import { IBaseRepository } from 'src/common/database/repositories/interfaces/base.interface';
import { EMAIL_VERIFICATION_TOKEN_TYPE } from 'src/common/constants/enums';
import { EmailVerificationToken } from '../../entities/email-verification-token.entity';

export const IEmailVerificationTokenRepository = Symbol(
  'IEmailVerificationTokenRepository',
);

type DefaultEntity = EmailVerificationToken;
export interface IEmailVerificationTokenRepository<T = DefaultEntity>
  extends IBaseRepository<T> {
  findOneByUserIdAndToken(
    userId: number,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<T>;
}
