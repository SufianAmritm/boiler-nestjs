import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
  EMAIL_VERIFICATION_TOKEN_STATUS,
  EMAIL_VERIFICATION_TOKEN_TYPE,
} from '../../../common/constants/enums';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Index('email_verification_tokens_pkey', ['id'], { unique: true })
@Entity('email_verification_tokens', { schema: 'public' })
export class EmailVerificationToken extends BaseEntity {
  @Column('character varying', { name: 'token', length: 255 })
  token: string;

  @Column('timestamp with time zone', { name: 'expired_at' })
  expiredAt: Date;

  @Column('enum', {
    name: 'status',
    enum: EMAIL_VERIFICATION_TOKEN_STATUS,
    default: EMAIL_VERIFICATION_TOKEN_STATUS.UNUSED,
  })
  status: EMAIL_VERIFICATION_TOKEN_STATUS;

  @Column('enum', {
    name: 'token_type',
    enum: EMAIL_VERIFICATION_TOKEN_TYPE,
    nullable: false,
  })
  tokenType: EMAIL_VERIFICATION_TOKEN_TYPE;

  @Column('integer', { name: 'user_id', nullable: true, unique: true })
  userId: number;

  @ManyToOne(() => User, (users) => users.emailVerificationTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
