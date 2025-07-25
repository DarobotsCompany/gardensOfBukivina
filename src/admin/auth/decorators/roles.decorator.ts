import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../administrators/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
