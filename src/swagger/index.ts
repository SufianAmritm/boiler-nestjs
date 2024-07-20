import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JWT, PROJECT_NAME, X_API_KEY } from '../common/constants';

export async function getSwaggerConfiguration(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle(`${PROJECT_NAME}`)
    .setDescription(`The ${PROJECT_NAME} API description`)
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: JWT }, JWT)
    .addApiKey({ type: 'apiKey', name: X_API_KEY, in: 'header' }, X_API_KEY)
    .addTag(`${PROJECT_NAME}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
