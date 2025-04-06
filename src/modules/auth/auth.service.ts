import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogInUserDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { User } from './../users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(logInUserDto: LogInUserDto): Promise<any> {
        const { userName, password } = logInUserDto;
        const user = await this.usersService.findUserByUserName(userName);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...usrWithoutPassword } = user;
            return usrWithoutPassword;
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
}
