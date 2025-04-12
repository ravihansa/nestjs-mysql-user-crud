import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { CustomCacheModule } from '../../common/utils/cache/customCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CustomCacheModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
