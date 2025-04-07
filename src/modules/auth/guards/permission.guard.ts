import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user) {
            const userPermSet = await this.authService.userPermissions(user.userId);
            if (requiredPermissions.some((perm) => userPermSet.has(perm))) {
                return true;
            }
        }
        return false;
    }
}
