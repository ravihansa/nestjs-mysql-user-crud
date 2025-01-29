import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { DbExceptionFilter } from './common/filters/db-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new DbExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
