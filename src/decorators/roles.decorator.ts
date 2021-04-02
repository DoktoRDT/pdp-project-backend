import { SetMetadata } from '@nestjs/common';

import { RoleTypes } from '../common/constants';

export const Roles = (...roles: RoleTypes[]) => SetMetadata('roles', roles);
