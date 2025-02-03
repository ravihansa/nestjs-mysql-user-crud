import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class LogInUserDto extends PickType(CreateUserDto, ['userName', 'password'] as const) { }
