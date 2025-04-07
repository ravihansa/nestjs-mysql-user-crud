import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    // Override canActivate function in the parent class
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Allow public routes
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }

        // Call parent authentication logic
        const result = await super.canActivate(context);
        return result as boolean;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw new UnauthorizedException('Invalid or missing JWT token');
        }
        return user;
    }
}
