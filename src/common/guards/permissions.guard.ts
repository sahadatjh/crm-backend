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

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied. No role assigned.');
    }

    const userPermissionSlugs: string[] = (user.role?.permissions ?? []).map(
      (p: { slug: string }) => p.slug,
    );

    const hasPermission = requiredPermissions.every((slug) =>
      userPermissionSlugs.includes(slug),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Access denied. Insufficient permissions.',
      );
    }

    return true;
  }
}
