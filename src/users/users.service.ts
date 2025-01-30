import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Company } from 'src/companies/entities/company.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Company) private readonly companyRepository: Repository<Company>
    ) { }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findOne(id);
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async createUserCompany(createUserCompanyDto: CreateUserCompanyDto): Promise<User> {
        const { fName, lName, userName, email, password, companyData } = createUserCompanyDto;

        // Check if companies already exist, otherwise create new ones
        const companyEntities = await Promise.all(
            companyData.map(async (companyDto) => {
                let company = await this.companyRepository.findOne({ where: { companyName: companyDto.companyName } });
                if (!company) {
                    company = this.companyRepository.create(companyDto);
                    await this.companyRepository.save(company);
                }
                return company;
            }),
        );

        // Create the User
        const newUser = this.userRepository.create({
            fName,
            lName,
            userName,
            email,
            password,
            companies: companyEntities,
        });

        return this.userRepository.save(newUser);
    }
}
