import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FindUserResponseDto } from '../dto/response.dto';

@Injectable()
export class UsersTransformer {
    transformUserData(userData: User): FindUserResponseDto {
        return {
            id: userData.id,
            fName: userData.fName,
            lName: userData.lName,
            userName: userData.userName,
            email: userData.email,
            role: userData.role.name,
            permissions: userData.role.permissions.map(permission => permission.name)
        };
    }

    transformUsersData(usersData: User[]): FindUserResponseDto[] {
        return usersData.map(userData => this.transformUserData(userData));
    }
}
