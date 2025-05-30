import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './../roles/entities/role.entity';
import { RolesService } from './../roles/roles.service';
import { hashPassword } from '../../common/utils/hashPassword';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
        private readonly rolesService: RolesService
    ) { }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({
            relations: ['role', 'role.permissions'],
            select: {
                id: true, fName: true, lName: true, userName: true, email: true,
                role: {
                    id: true, name: true,
                    permissions: {
                        id: true, name: true
                    }
                }
            }
        });
    }

    async findOne(usrId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: usrId },
            relations: ['role', 'role.permissions'],
            select: {
                id: true, fName: true, lName: true, userName: true, email: true,
                role: {
                    id: true, name: true,
                    permissions: {
                        id: true, name: true
                    }
                }
            }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${usrId} not found`);
        }
        return user;
    }

    async findUserByUserName(usrName: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { userName: usrName },
            relations: {
                role: {
                    permissions: true,
                },
            },
            select: {
                id: true,
                fName: true,
                lName: true,
                userName: true,
                email: true,
                password: true,
                role: {
                    id: true,
                    name: true,
                    permissions: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!user) {
            throw new NotFoundException(`User with userName ${usrName} not found`);
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { fName, lName, userName, email, password, roleName } = createUserDto;
        const hashedPw = await hashPassword(password);
        const role: Role = await this.rolesService.findRoleByName(roleName);
        const user = this.userRepository.create({
            fName,
            lName,
            userName,
            email,
            password: hashedPw,
            role: role
        });
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

    async createUserWithCompany(createUserCompanyDto: CreateUserCompanyDto): Promise<User> {
        const { fName, lName, userName, email, password, roleName, companyData } = createUserCompanyDto;
        const hashedPw = await hashPassword(password);
        const role: Role = await this.rolesService.findRoleByName(roleName);
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

        // Create the User with companies
        const newUser = this.userRepository.create({
            fName,
            lName,
            userName,
            email,
            password: hashedPw,
            role: role,
            companies: companyEntities,
        });

        return this.userRepository.save(newUser);
    }

    async findUserWithCompanyList(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['companies'],
            select: {
                id: true,
                userName: true,
                email: true,
                companies: {
                    id: true, //Always include id to avoid missing relations
                    companyName: true
                }
            }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
}
