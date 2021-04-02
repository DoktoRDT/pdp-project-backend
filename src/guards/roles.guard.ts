import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTypes } from '../common/constants';
import { UserEntity } from '../modules/user/entities';

function resolveRoles(role: RoleTypes): RoleTypes[] {
  const roles = {
    [RoleTypes.PLAYER]: [],
    [RoleTypes.ADMIN]: [ RoleTypes.PLAYER ],
  };

  if (!roles[role]) {
    return [];
  }

  const inherited = roles[role] || [];
  return [ role, ...inherited ];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<RoleTypes[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    const userRoles = resolveRoles(user?.role?.name);
    return roles.some(role => userRoles.includes(role));
  }
}
