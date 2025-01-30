import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false, length: 100 })
    companyName: string;

    @Column({ nullable: false, length: 100 })
    address: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User,
        (user) => user.companies)
    users: User[]
}
