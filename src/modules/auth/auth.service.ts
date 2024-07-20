import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { EMAIL_VERIFICATION_TOKEN_TYPE } from 'src/common/constants/enums';
import { APP_ERROR_MESSAGES } from 'src/common/constants/errors';
import { UtilsService } from 'src/common/utils/UtilsService';
import { IUserService } from '../user/interfaces/user.interface';
import { BcryptService } from './bcrypt.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenType } from './type/auth.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserService) private readonly userService: IUserService,
    private readonly utilsService: UtilsService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signupDto: SignUpDto): Promise<string | number> {
    signupDto.password = await this.bcryptService.hash(signupDto.password);
    await this.userService.createUser(signupDto);
    return RESPONSE_MESSAGES.VERIFICATION;
  }

  async signIn(signInDto: SignInDto): Promise<TokenType> {
    const { email, password } = signInDto;
    const user = await this.userService.checkIfUserByEmailExists(email);
    if (!user) {
      throw new NotFoundException(APP_ERROR_MESSAGES.NOT_FOUND('User'));
    }

    const isPasswordMatch = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException(APP_ERROR_MESSAGES.INVALID_PASSWORD);
    }
    return this.getTokens(user.id, email);
  }

  verify(token: string): Promise<string> {
    const emailTodecryptken = this.utilsService.decrypt(token);
    const [email, id, tokenType] = emailTodecryptken.split('-');
    const tokenTypeEnum = tokenType as EMAIL_VERIFICATION_TOKEN_TYPE;
    return this.userService.verify(+id, email, token, tokenTypeEnum);
  }

  async resetPassword(
    token: string,
    password: string,
    tokenType: string,
  ): Promise<string> {
    const emailTodecryptken = this.utilsService.decrypt(token);
    const [email, id] = emailTodecryptken.split('-');
    const tokenTypeEnum = tokenType as EMAIL_VERIFICATION_TOKEN_TYPE;
    const hashedPassword = await this.bcryptService.hash(password);
    return this.userService.resetPassword(
      +id,
      email,
      hashedPassword,
      token,
      tokenTypeEnum,
    );
  }

  private async getTokens(id: number, email: string): Promise<TokenType> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      ),
    ]);
    return {
      message: RESPONSE_MESSAGES.SIGN_IN,
      accessToken,
      refreshToken,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<string> {
    return this.userService.forgetPassword(forgetPasswordDto);
  }
}
