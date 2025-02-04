import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { LogInUserDto } from './dto/login-auth.dto';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async logIn(@Body() logInUserDto: LogInUserDto) {
        const user = await this.authService.validateUser(logInUserDto);
        const token = await this.authService.logIn(user);
        return { message: 'User logged in successfully', data: token };
    }
}
