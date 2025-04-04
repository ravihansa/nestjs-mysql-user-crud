import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => User, user => user.role)
    users: User[];

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'roles_permissions',
        joinColumn: {
            name: 'roleId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id'
        },
    })
    permissions: Permission[];
}
