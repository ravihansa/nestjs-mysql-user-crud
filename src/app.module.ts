import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import configuration from './config/configuration';
import { CompanyModule } from './modules/companies/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Makes ConfigModule available throughout the app
    load: [configuration],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.userName'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.name'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: configService.get<boolean>('DB_SYNC', false), // Use false in production
    }),
  }),
    UsersModule, CompanyModule, AuthModule, JwtModule],
  controllers: [AppController],
  providers: [AppService, AuthService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})

export class AppModule { }
