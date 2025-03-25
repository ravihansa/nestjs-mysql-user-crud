import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    let companyRepository: Repository<Company>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Company),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        companyRepository = module.get<Repository<Company>>(getRepositoryToken(Company));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = [{ id: 1, fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com' }];
            jest.spyOn(userRepository, 'find').mockResolvedValue(result as User[]);

            expect(await service.findAll()).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single user', async () => {
            const result = { id: 1, fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com' };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(result as User);

            expect(await service.findOne(1)).toBe(result);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findUserByUserName', () => {
        it('should return a user by username', async () => {
            const result = { id: 1, fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com', password: 'hashedPassword' };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(result as User);

            expect(await service.findUserByUserName('johndoe')).toBe(result);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findUserByUserName('johndoe')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = { fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com', password: 'password' };
            const result = { ...createUserDto, id: 1, password: 'hashedPassword' };
            jest.spyOn(userRepository, 'create').mockReturnValue(result as User);
            jest.spyOn(userRepository, 'save').mockResolvedValue(result as User);

            expect(await service.create(createUserDto)).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { fName: 'Johnny' };
            const user = { id: 1, fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com' };
            jest.spyOn(service, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'update').mockResolvedValue({} as any);
            jest.spyOn(service, 'findOne').mockResolvedValue({ ...user, ...updateUserDto } as User);

            expect(await service.update(1, updateUserDto)).toEqual({ ...user, ...updateUserDto });
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const user = { id: 1, fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com' };
            jest.spyOn(service, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'remove').mockResolvedValue({} as any);

            await service.remove(1);
            expect(userRepository.remove).toHaveBeenCalledWith(user);
        });
    });

    describe('createUserWithCompany', () => {
        it('should create a user with companies', async () => {
            const usr = { fName: 'John', lName: 'Doe', userName: 'johndoe', email: 'john@example.com', password: 'password' };
            const cpny = { companyName: 'Company A', address: 'Company A address' };
            const createUserCompanyDto: CreateUserCompanyDto = {
                ...usr,
                companyData: [cpny],
            };
            const company = { id: 1, ...cpny };
            const user = { ...usr, id: 1, password: 'hashedPassword', companies: [company] };
            jest.spyOn(companyRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(companyRepository, 'create').mockReturnValue(company as Company);
            jest.spyOn(companyRepository, 'save').mockResolvedValue(company as Company);
            jest.spyOn(userRepository, 'create').mockReturnValue(user as User);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user as User);

            expect(await service.createUserWithCompany(createUserCompanyDto)).toBe(user);
        });
    });

    describe('findUserWithCompanyList', () => {
        it('should return a user with company list', async () => {
            const user = { id: 1, userName: 'johndoe', email: 'john@example.com', companies: [{ id: 1, companyName: 'Company A' }] };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            expect(await service.findUserWithCompanyList(1)).toBe(user);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findUserWithCompanyList(1)).rejects.toThrow(NotFoundException);
        });
    });
});
