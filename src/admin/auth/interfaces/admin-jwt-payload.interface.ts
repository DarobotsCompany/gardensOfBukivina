import { RolesEnum } from '../../roles/enums/roles.enum';

export interface IAdminJwtPayload {
    id: number;
    email: string;
    role: RolesEnum;
}