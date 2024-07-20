import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import {
  DOMAIN_ENTITY,
  EMAIL_SUBJECT,
  RESPONSE_MESSAGES,
} from 'src/common/constants';
import {
  EMAIL_VERIFICATION_TOKEN_STATUS,
  EMAIL_VERIFICATION_TOKEN_TYPE,
} from 'src/common/constants/enums';
import { APP_ERROR_MESSAGES } from 'src/common/constants/errors';
import {
  DbTransactionFactory,
  TransactionRunner,
} from 'src/common/database/utils/db-transaction-factory';
import { UtilsService } from 'src/common/utils/UtilsService';
import { EntityManager } from 'typeorm';
import { ForgetPasswordDto } from '../auth/dto/forget-password.dto';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { IEmailService } from '../email/interfaces/email.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/user.interface';
import { IEmailVerificationTokenRepository } from './repositories/interfaces/email-verification-token.interface';
import { IUserRepository } from './repositories/interfaces/user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IEmailVerificationTokenRepository)
    private readonly tokenRepository: IEmailVerificationTokenRepository,
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(IEmailService) private readonly emailService: IEmailService,
    private readonly utilsService: UtilsService,
    private readonly dbTransactionFactory: DbTransactionFactory,
  ) {}

  async createUser(signUpDto: SignUpDto): Promise<number | string> {
    let runner: TransactionRunner;
    try {
      const { email } = signUpDto;
      const userMap = this.classMapper.map(signUpDto, SignUpDto, User);
      const userExist = await this.checkIfUserByEmailExists(email);
      if (userExist) {
        if (!userExist.isVerified) {
          const existingToken = await this.tokenRepository.findOne(
            {
              userId: userExist.id,
            },
            {
              expiredAt: true,
              id: true,
            },
          );

          if (existingToken && existingToken.expiredAt) {
            const remainingExpireTime =
              existingToken.expiredAt.getTime() - new Date().getTime();
            if (remainingExpireTime > 2 * 60 * 60) {
              return RESPONSE_MESSAGES.ALREADY_SENT_SENT_VERIFICATION;
            }
            await this.sendEmailVerification(
              null,
              email,
              userExist.id,
              EMAIL_SUBJECT.VERIFICATION,
              'registration.ejs',
              EMAIL_VERIFICATION_TOKEN_TYPE.VERIFICATION,
              existingToken.id,
            );
          }

          if (!existingToken) {
            await this.sendEmailVerification(
              null,
              email,
              userExist.id,
              EMAIL_SUBJECT.VERIFICATION,
              'registration.ejs',
              EMAIL_VERIFICATION_TOKEN_TYPE.VERIFICATION,
            );
          }

          return RESPONSE_MESSAGES.VERIFICATION;
        }

        throw new Error(
          APP_ERROR_MESSAGES.ALREADY_EXISTS('User', `email: ${email}`),
        );
      }

      runner = await this.dbTransactionFactory.transactionRunner();
      const transactionManager = runner.manager;

      await runner.start();
      const userRepository = transactionManager.getRepository(User);
      const user = await this.userRepository.createWithTransaction<User>(
        userMap,
        userRepository,
        transactionManager,
      );
      const { id } = user;
      delete user.password;

      await this.sendEmailVerification(
        transactionManager,
        email,
        id,
        EMAIL_SUBJECT.VERIFICATION,
        'registration.ejs',
        EMAIL_VERIFICATION_TOKEN_TYPE.VERIFICATION,
      );

      await runner.end();
      return id;
    } catch (error) {
      if (runner) {
        await runner.rollbackTransaction();
      }
      throw new Error(error.message);
    }
  }

  async verify(
    userId: number,
    email: string,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<string> {
    const [user, emailToken] = await Promise.all([
      this.userRepository.findOneByIDAndEmail(userId, email),
      this.tokenRepository.findOneByUserIdAndToken(userId, token, tokenType),
    ]);

    if (!user) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND('User'));
    }

    if (tokenType === EMAIL_VERIFICATION_TOKEN_TYPE.VERIFICATION) {
      if (user.isVerified) {
        throw new Error(APP_ERROR_MESSAGES.ALREADY_VERIFIED);
      }
    }

    if (!emailToken) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND('Token'));
    }

    const { id, status, expiredAt } = emailToken;

    if (
      status === EMAIL_VERIFICATION_TOKEN_STATUS.EXPIRED ||
      expiredAt < new Date()
    ) {
      emailToken.status = EMAIL_VERIFICATION_TOKEN_STATUS.EXPIRED;
      await this.tokenRepository.update({ id }, emailToken);
      throw new Error(APP_ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    if (status === EMAIL_VERIFICATION_TOKEN_STATUS.USED) {
      throw new Error(APP_ERROR_MESSAGES.ALREADY_USED);
    }

    emailToken.status = EMAIL_VERIFICATION_TOKEN_STATUS.USED;
    await this.tokenRepository.update({ id }, emailToken);
    if (emailToken.tokenType === EMAIL_VERIFICATION_TOKEN_TYPE.PASSWORD_RESET) {
      return RESPONSE_MESSAGES.VERIFY;
    }

    user.isVerified = true;
    await this.userRepository.updateUserById(userId, user);
    return RESPONSE_MESSAGES.VERIFY;
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<string> {
    const { email } = forgetPasswordDto;
    const userExist = await this.checkIfUserByEmailExists(email);
    if (!userExist) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND('User'));
    }

    if (!userExist.isVerified) {
      throw new Error(APP_ERROR_MESSAGES.NOT_VERIFIED);
    }

    await this.sendEmailVerification(
      null,
      email,
      userExist.id,
      EMAIL_SUBJECT.RESET_PASSWORD,
      'password_reset.ejs',
      EMAIL_VERIFICATION_TOKEN_TYPE.PASSWORD_RESET,
    );
    return RESPONSE_MESSAGES.RESET_PASSWORD_EMAIL;
  }

  async resetPassword(
    id: number,
    email: string,
    password: string,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<string> {
    const [user, emailToken] = await Promise.all([
      this.userRepository.findOneByIDAndEmail(id, email),
      this.tokenRepository.findOneByUserIdAndToken(id, token, tokenType),
    ]);
    if (!user) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND('User'));
    }
    if (!emailToken) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND('Token'));
    }

    const { status, expiredAt } = emailToken;
    if (
      status === EMAIL_VERIFICATION_TOKEN_STATUS.EXPIRED ||
      expiredAt < new Date()
    ) {
      emailToken.status = EMAIL_VERIFICATION_TOKEN_STATUS.EXPIRED;
      await this.tokenRepository.update({ id }, emailToken);
      throw new Error(APP_ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    if (status === EMAIL_VERIFICATION_TOKEN_STATUS.USED) {
      throw new Error(APP_ERROR_MESSAGES.ALREADY_USED);
    }

    emailToken.status = EMAIL_VERIFICATION_TOKEN_STATUS.USED;
    user.password = password;
    await Promise.all([
      await this.tokenRepository.update({ id }, emailToken),
      await this.userRepository.update({ id }, user),
    ]);
    return RESPONSE_MESSAGES.RESET_PASSWORD;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error(APP_ERROR_MESSAGES.NOT_FOUND(`${DOMAIN_ENTITY.USER}`));
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: number): Promise<string> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error(
        APP_ERROR_MESSAGES.ALREADY_IN_ACTIVE(DOMAIN_ENTITY.SUPPLIER),
      );
    }
    await this.userRepository.softDelete({ id });
    return RESPONSE_MESSAGES.IN_ACTIVATED;
  }

  async activate(id: number): Promise<string> {
    const visaConfiguration = await this.findOne(id);
    if (visaConfiguration) {
      throw new Error(
        APP_ERROR_MESSAGES.ALREADY_ACTIVE(DOMAIN_ENTITY.VISA_CONFIGURATION),
      );
    }
    await this.userRepository.restore({ id });
    return RESPONSE_MESSAGES.ACTIVATED;
  }

  async checkIfUserByEmailExists(email: string): Promise<User> {
    return await this.userRepository.findOneByEmail(email);
  }

  private async sendEmailVerification(
    transactionManager: EntityManager,
    email: string,
    id: number,
    subject: string,
    templatePath: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
    tokenId?: number,
  ) {
    await this.emailService.send({
      email,
      data: {
        title: 'Sidali Assoul',
        content: 'content',
      },
      subject,
      templatePath,
      attachment: undefined,
      inline: undefined,
    });
    const emailTokenEncrypt = this.utilsService.encrypt(
      `${email}-${id}-${tokenType}`,
    );

    const expirationMinutes = this.utilsService.getEnvironmentVariable<number>(
      'EMAIL_VERIFICATION_EXPIRATION_MINUTES',
    );

    const token: EmailVerificationToken = {
      userId: id,
      token: emailTokenEncrypt,
      expiredAt: new Date(Date.now() + expirationMinutes * 60 * 1000),
      tokenType,
    } as EmailVerificationToken;
    if (transactionManager) {
      const tokenRepository = transactionManager.getRepository(
        EmailVerificationToken,
      );
      await this.tokenRepository.createWithTransaction<EmailVerificationToken>(
        token,
        tokenRepository,
        transactionManager,
      );
    } else if (tokenId) {
      await this.tokenRepository.update({ id: tokenId }, token);
    } else {
      await this.tokenRepository.create(token);
    }
  }
}
