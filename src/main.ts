import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as os from 'os';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/reponse-format-interceptor';
import { getSwaggerConfiguration } from './swagger';

function getLocalHost(): string {
  const interfaces = os.networkInterfaces();
  let address = null;
  Object.keys(interfaces).some((name: string) => {
    return interfaces[name]!.some((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        address = iface.address;
        return true;
      }
      return false;
    });
  });

  return address || 'localhost';
}
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
    bodyParser: true,
  });

  app.enableCors({
    origin: process.env.BASE_FRONT_END_URL,
    methods: ['PATCH', 'DELETE', 'HEAD', 'POST', 'PUT', 'GET', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await getSwaggerConfiguration(app);
  await app.listen(configService.get<number>('PORT'));

  const port = configService.get<number>('PORT') || 3000;
  const host = getLocalHost();

  const baseUrl = `http://${host}:${port}/`;
  const swaggerUrl = `${baseUrl}api#/`;
  console.info(
    `Application is running on: \u001b]8;;${baseUrl}\u001b\\${baseUrl}\u001b]8;;\u001b\\`,
  );
  console.info(
    `Swagger is available on: \u001b]8;;${swaggerUrl}\u001b\\${swaggerUrl}\u001b]8;;\u001b\\`,
  );
}
bootstrap();
