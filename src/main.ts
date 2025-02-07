import { Logger } from 'winston';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DbExceptionFilter } from './common/filters/db-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { swgrConfig, swgrOptions, swgrCustomOptions } from './common/utils/swagger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new LoggingInterceptor(logger), new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(logger), new DbExceptionFilter(logger));
  const document = SwaggerModule.createDocument(app, swgrConfig, swgrOptions);
  SwaggerModule.setup('api/docs', app, document, swgrCustomOptions);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
