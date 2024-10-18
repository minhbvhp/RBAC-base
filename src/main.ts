import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';
import { configSwagger } from './configs/api-docs.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api', { exclude: [''] });

  if (process.env.NODE_ENV !== 'production') {
    configSwagger(app);
    app.useStaticAssets(join(__dirname, './served'));
  }

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
