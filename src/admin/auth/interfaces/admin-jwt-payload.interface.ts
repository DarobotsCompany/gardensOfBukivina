import { RolesEnum } from '../../administrators/enums/roles.enum';

export interface IAdminJwtPayload {
    id: number;
    email: string;
    role: RolesEnum;
}