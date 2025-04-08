import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogInUserDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { User } from './../users/entities/user.entity';
import { CustomCache } from '../../common/utils/cache/customCache.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private customCache: CustomCache
    ) { }

    async validateUser(logInUserDto: LogInUserDto): Promise<User> {
        const { userName, password } = logInUserDto;
        const user = await this.usersService.findUserByUserName(userName);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...usrWithoutPassword } = user;
            return usrWithoutPassword as User;
        } else {
            throw new UnauthorizedException();
        }
    }

    async logIn(user: User) {
        const permList = user.role?.permissions?.map((perm) => perm.name);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role?.name,
            permissions: permList
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async userPermissions(userId: number): Promise<Set<string>> {
        const cacheKey = `auth__userPermissions__${userId}`;
        const cachedUsrPerms = await this.customCache.getCache(cacheKey);
        if (cachedUsrPerms) {
            return new Set(cachedUsrPerms);
        }
        const user = await this.usersService.findOne(userId);
        const permList = user.role?.permissions?.map((perm) => perm.name);
        await this.customCache.setCache(cacheKey, permList, 60000); // Cache ttl is 60secs
        return new Set(permList);
    }
}
