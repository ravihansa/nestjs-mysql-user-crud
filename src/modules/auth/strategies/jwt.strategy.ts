import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            ignoreExpiration: false, // Expired tokens are rejected
            secretOrKey: configService.get<string>('jwtSecret'),
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, userName: payload.userName };
    }
}
