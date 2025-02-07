import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('list')
  async findAll() {
    const companyList = await this.companyService.findAll();
    return { message: 'Company list', data: companyList };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const company = await this.companyService.findOne(id);
    return { message: 'Company data', data: company };
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyService.create(createCompanyDto);
    return { message: 'Company created successfully', data: company };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }

  @Get(':id/user')
  @ApiOperation({ summary: 'Get company users data.' })
  @ApiResponse({ status: 200, description: 'Company details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async companyWithUserList(@Param('id', ParseIntPipe) id: number) {
    const user = await this.companyService.findCompanyWithUserList(id);
    return { message: 'Company users data', data: user };
  }

}
