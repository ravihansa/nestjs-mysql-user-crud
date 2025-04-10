import { Module, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { RolesModule } from './../roles/roles.module';
import { Company } from '../companies/entities/company.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersTransformer } from './transformers/users.transformer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company]),
    RolesModule,
    forwardRef(() => AuthModule)], // Used the forwardRef() utility function to resolve circular dependencies between auth and users modules
  controllers: [UsersController],
  providers: [UsersService, UsersTransformer],
  exports: [UsersService],
})

export class UsersModule { }
