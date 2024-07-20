import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { localDbConfig, dbEnvironment, prodDbConfig } from 'src/common/config/';
import { ENVIRONMENTS } from '../constants/enums';

@Injectable()
export class DatabaseModule implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const mainOptions = {
      type: 'postgres',
      keepConnectionAlive: true,
      autoLoadEntities: true,
      logging: true,
      extra: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000,
      },
    };
    if (dbEnvironment === ENVIRONMENTS.PROD) {
      return {
        ...mainOptions,
        ...prodDbConfig.database,
      } as TypeOrmModuleOptions;
    }
    return {
      ...mainOptions,
      ...localDbConfig.database,
    } as TypeOrmModuleOptions;
  }
}
