import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { CreateUserCompanySchema } from './schemas/create-user-company.schema';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('list')
  async findAll() {
    const usersList = await this.usersService.findAll();
    return { message: 'Users list', data: usersList };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { message: 'User data', data: user };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', data: user };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('company')
  async createUserWithCompany(
    @Body(new JoiValidationPipe(CreateUserCompanySchema)) createUserCompanyDto: CreateUserCompanyDto
  ) {
    const user = await this.usersService.createUserWithCompany(createUserCompanyDto);
    return { message: 'User created with companies successfully', data: user };
  }

  @Get(':id/company')
  async userWithCompanyList(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserWithCompanyList(id);
    return { message: 'User company data', data: user };
  }
}
