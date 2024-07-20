import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbTransactionFactory } from 'src/common/database/utils/db-transaction-factory';
import { EmailModule } from '../email/email.module';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/user.interface';
import { UserMappingProfile } from './mapping/user.mapping';
import { EmailVerificationTokenRepository } from './repositories/email-verification-token.repository';
import { IEmailVerificationTokenRepository } from './repositories/interfaces/email-verification-token.interface';
import { IUserRepository } from './repositories/interfaces/user.interface';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export const userEntities = [User, EmailVerificationToken];

export const UserRepositoryProvider = [
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: IEmailVerificationTokenRepository,
    useClass: EmailVerificationTokenRepository,
  },
];

const UserServiceProvider = [
  {
    provide: IUserService,
    useClass: UserService,
  },
];
@Module({
  imports: [TypeOrmModule.forFeature([...userEntities]), EmailModule],
  controllers: [UserController],
  providers: [
    DbTransactionFactory,
    UserMappingProfile,
    ...UserRepositoryProvider,
    ...UserServiceProvider,
  ],
  exports: [...UserServiceProvider],
})
export class UserModule {}
