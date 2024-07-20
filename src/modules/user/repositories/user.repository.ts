import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsBuilder } from 'src/common/database/builder-pattern/find-options.builder';
import { BaseRepository } from 'src/common/database/repositories/base/base.repository';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './interfaces/user.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  async findOneByEmail(email: string): Promise<User> {
    const findOption = new FindOptionsBuilder<User>()
      .where({
        email,
      })
      .build();
    return this.findOneWithBuilderOption(findOption);
  }

  async findOneByIDAndEmail(userId: number, email: string): Promise<User> {
    const findOption = new FindOptionsBuilder<User>()
      .where({
        email,
        id: userId,
      })
      .build();
    return this.findOneWithBuilderOption(findOption);
  }

  async updateUserById(id: number, user: User): Promise<UpdateResult> {
    const whereOption: FindOptionsWhere<User> = {
      id,
    };
    return this.update(whereOption, user);
  }

  async findOneById(id: number): Promise<User> {
    const findOption = new FindOptionsBuilder<User>()
      .where({
        id,
      })
      .build();
    return this.findOneWithBuilderOption(findOption);
  }
}
