import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DataSource, DataSourceOptions } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AxiosModule } from './common/axios/axiosModule';
import { DatabaseModule } from './common/database';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UtilsModule } from './common/utils/UtilsModule';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { envSchema } from './modules/env/env';
import { EnvModule } from './modules/env/env.module';
import { ServerMonitorCronModule } from './crons/server-monitor/server-monitor-cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseModule,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLE_TTL'),
            limit: config.get('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),
    //! Add Module in Alphabetical Order
    ServerMonitorCronModule,
    AuthModule,
    AxiosModule,
    EmailModule,
    EnvModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(LoggerMiddleware).forRoutes('*');
  }
}
