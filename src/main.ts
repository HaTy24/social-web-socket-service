import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { INJECTION_TOKEN } from '@shared/constants';
import { HttpResponseInterceptor } from '@shared/utils/interceptors/http-response.interceptor';
import { HttpLoggingInterceptor } from '@shared/utils/interceptors/logging.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);
  const configService = app.get(ConfigService);

  const isProduction = ['production', 'prod'].includes(
    configService.get('APP_ENV', 'production').toLowerCase(),
  );

  if (!isProduction) {
    app.enableCors();
  }

  app.setGlobalPrefix('v1/api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new HttpResponseInterceptor(auditService),
  );

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
