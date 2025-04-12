import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomCache } from '../../common/utils/cache/customCache.service';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
        private readonly customCache: CustomCache
    ) { }

    async findAll(): Promise<Company[]> {
        return await this.companyRepository.find();
    }

    async findOne(id: number): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const company = this.companyRepository.create(createCompanyDto);
        return await this.companyRepository.save(company);
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        await this.findOne(id);
        await this.companyRepository.update(id, updateCompanyDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const company = await this.findOne(id);
        await this.companyRepository.remove(company);
    }

    async findCompanyWithUserList(comId: number): Promise<Company> {
        const cacheKey = `company__findCompanyWithUserList__${comId}`;
        const cachedCmpnyUsr = await this.customCache.getCache(cacheKey);
        if (cachedCmpnyUsr) {
            return cachedCmpnyUsr as Company;
        }

        const company = await this.companyRepository
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.users', 'user')
            .select([
                'company.id',
                'company.companyName',
                'user.id',
                'user.userName',
                'user.email'
            ])
            .where('company.id = :comId', { comId })
            .getOne();
        if (!company) {
            throw new NotFoundException(`Company with ID ${comId} not found`);
        }
        await this.customCache.setCache(cacheKey, company, 10000); // Cache ttl is 10secs
        return company;
    }
}
