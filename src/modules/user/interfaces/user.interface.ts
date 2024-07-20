import { EMAIL_VERIFICATION_TOKEN_TYPE } from 'src/common/constants/enums';
import { ForgetPasswordDto } from 'src/modules/auth/dto/forget-password.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export const IUserService = Symbol('IUserService');

export interface IUserService {
  resetPassword(
    id: number,
    email: string,
    password: string,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<string>;
  forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<string>;
  createUser(signUpDto: SignUpDto): Promise<number | string>;
  update(id: number, data: UpdateUserDto): Promise<UpdateResult>;
  checkIfUserByEmailExists(email: string): Promise<User>;
  verify(
    userId: number,
    email: string,
    token: string,
    tokenType: EMAIL_VERIFICATION_TOKEN_TYPE,
  ): Promise<string>;
  findOne(id: number): Promise<User>;
  remove(id: number): Promise<string>;
  activate(id: number): Promise<string>;
}
