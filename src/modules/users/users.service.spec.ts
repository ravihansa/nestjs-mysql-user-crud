import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { UsersService } from './users.service';

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

});
