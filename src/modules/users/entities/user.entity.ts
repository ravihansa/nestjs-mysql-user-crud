import { Company } from '../../companies/entities/company.entity';
import { Role } from '../../roles/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';

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

    @Column()
    roleId: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'roleId' })
    role: Role;

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
