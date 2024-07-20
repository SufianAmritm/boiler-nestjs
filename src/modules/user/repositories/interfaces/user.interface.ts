import { IBaseRepository } from 'src/common/database/repositories/interfaces/base.interface';
import { UpdateResult } from 'typeorm';
import { User } from '../../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

type DefaultEntity = User;
export interface IUserRepository<T = DefaultEntity> extends IBaseRepository<T> {
  findOneByEmail(email: string): Promise<T>;
  findOneByIDAndEmail(userId: number, email: string): Promise<T>;
  updateUserById(id: number, user: User): Promise<UpdateResult>;
  findOneById(id: number): Promise<T>;
}
