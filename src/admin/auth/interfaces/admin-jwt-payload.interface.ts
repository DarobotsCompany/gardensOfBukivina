import { RolesEnum } from '../../administrators/enums/roles.enum';

export interface IAdminJwtPayload {
    id: number;
    username: string;
    email: string;
    role: RolesEnum;
}