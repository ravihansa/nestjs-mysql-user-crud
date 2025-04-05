import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './../permissions/entities/permission.entity';
import { CreateRolePermissionDto } from './dto/create-role-with-permission.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
  ) { }

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async createRoleWithPermissions(createRolePermissionDto: CreateRolePermissionDto): Promise<Role> {
    const { name, description, permissionsList } = createRolePermissionDto;

    // Check if the permissions already exist, otherwise send an error
    const permissionEntities: Permission[] = await Promise.all(
      permissionsList.map(async (permissionName) => {
        let perm = await this.permissionRepository.findOne({ where: { name: permissionName } });
        if (!perm) {
          throw new NotFoundException(`Permission with name ${permissionName} not found`);
        }
        return perm;
      }),
    );

    const role = await this.roleRepository.findOne({ where: { name: name }, relations: ['permissions'] });
    if (role) {
      // Add new permissions to the existing role
      if (role?.permissions?.length) {
        const currentPermissionIds: Set<number> = new Set(role.permissions.map(p => p.id));
        permissionEntities.map(item => {
          if (!currentPermissionIds.has(item.id)) {
            role.permissions.push(item);
          }
        });
      } else {
        role.permissions = permissionEntities;
      }
      return await this.roleRepository.save(role);
    } else {
      // Create a role with the provided existing permissions
      const newRole = this.roleRepository.create({
        name,
        description,
        permissions: permissionEntities,
      });
      return await this.roleRepository.save(newRole);
    }
  }
}
