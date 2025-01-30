import { Company } from 'src/companies/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    fName: string;

    @Column({ length: 100 })
    lName: string;

    @Column({ unique: true, nullable: false })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Company,
        (company) => company.users)
    @JoinTable({
        name: 'users_companies',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'companyId',
            referencedColumnName: 'id',
        }
    })
    companies: Company[];
}
