import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmailVerificationToken } from './email-verification-token.entity';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class User extends BaseEntity {
  @AutoMap()
  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @AutoMap()
  @Column('character varying', { name: 'name', length: 255, nullable: true })
  name?: string;

  @AutoMap()
  @Exclude()
  @Column('character varying', { name: 'password', length: 255 })
  password: string;

  @AutoMap()
  @Column('boolean', {
    name: 'is_verified',
    nullable: false,
    default: false,
  })
  isVerified: boolean;

  @AutoMap()
  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @OneToMany(
    () => EmailVerificationToken,
    (emailVerificationTokens) => emailVerificationTokens.user,
  )
  emailVerificationTokens: EmailVerificationToken[];
}
