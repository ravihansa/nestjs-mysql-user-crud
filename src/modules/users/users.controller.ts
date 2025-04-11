import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { UsersTransformer } from './transformers/users.transformer';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { CreateUserCompanySchema } from './schemas/create-user-company.schema';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('users')
@UseGuards(PermissionGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersTransformer: UsersTransformer
  ) { }

  @Get('list')
  @RequirePermissions('view-user')
  async findAll() {
    const usersList = await this.usersService.findAll();
    return { message: 'Users list', data: this.usersTransformer.transformUsersData(usersList) };
  }

  @Get(':id')
  @RequirePermissions('view-user')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { message: 'User data', data: this.usersTransformer.transformUserData(user) };
  }

  @Post()
  @RequirePermissions('create-user')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', data: user };
  }

  @Patch(':id')
  @RequirePermissions('update-user')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return { message: 'User updated successfully', data: user };
  }

  @Delete(':id')
  @RequirePermissions('delete-user')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully', data: null };
  }

  @Post('company')
  // @UseGuards(JwtAuthGuard)
  @RequirePermissions('create-user')
  async createUserWithCompany(
    @Body(new JoiValidationPipe(CreateUserCompanySchema)) createUserCompanyDto: CreateUserCompanyDto
  ) {
    const user = await this.usersService.createUserWithCompany(createUserCompanyDto);
    return { message: 'User created with companies successfully', data: user };
  }

  @Get(':id/company')
  @RequirePermissions('view-user')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  async userWithCompanyList(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserWithCompanyList(id);
    return { message: 'User company data', data: user };
  }
}
