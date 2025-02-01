import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from '../../companies/dto/create-company.dto';


export class CreateUserCompanyDto extends IntersectionType(CreateUserDto) {

  @ValidateNested({ each: true })
  @Type(() => CreateCompanyDto)
  companyData: CreateCompanyDto[];

}
