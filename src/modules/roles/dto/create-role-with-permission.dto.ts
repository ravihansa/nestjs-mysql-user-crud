import { CreateRoleDto } from './create-role.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CreateRolePermissionDto extends IntersectionType(CreateRoleDto) {

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    permissionsList: string[];

}
