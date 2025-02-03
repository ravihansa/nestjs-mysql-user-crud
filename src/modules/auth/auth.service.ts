import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogInUserDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
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

    async logIn(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
