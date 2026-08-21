import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException('Access denied. No roles assigned.');
    }

    const userPermissionSlugs = new Set<string>();
    for (const role of user.roles) {
      if (role.permissions) {
        for (const p of role.permissions) {
          userPermissionSlugs.add(p.slug);
        }
      }
    }

    const hasPermission = requiredPermissions.every((slug) =>
      userPermissionSlugs.has(slug),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Access denied. Insufficient permissions.',
      );
    }

    return true;
  }
}
