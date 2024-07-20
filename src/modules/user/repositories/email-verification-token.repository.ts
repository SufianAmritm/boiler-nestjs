import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL_VERIFICATION_TOKEN_TYPE } from 'src/common/constants/enums';
import { FindOptionsBuilder } from 'src/common/database/builder-pattern/find-options.builder';
import { BaseRepository } from 'src/common/database/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { IEmailVerificationTokenRepository } from './interfaces/email-verification-token.interface';

@Injectable()
export class EmailVerificationTokenRepository
  extends BaseRepository<EmailVerificationToken>
  implements IEmailVerificationTokenRepository
{
  constructor(
    @InjectRepository(EmailVerificationToken)
    public readonly repository: Repository<EmailVerificationToken>,
  ) {
    super(repository);
  }

  async findOneByUserIdAndToken(
    userId: number,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<EmailVerificationToken> {
    const findOption = new FindOptionsBuilder<EmailVerificationToken>()
      .where({
        token,
        userId,
        tokenType,
      })
      .build();
    return this.findOneWithBuilderOption(findOption);
  }
}
