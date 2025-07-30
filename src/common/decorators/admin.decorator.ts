import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { IAdminJwtPayload } from 'src/admin/auth/interfaces/admin-jwt-payload.interface';

export const Admin = createParamDecorator(
    (key: keyof IAdminJwtPayload, ctx: ExecutionContext): IAdminJwtPayload | Partial<IAdminJwtPayload> => {
        const request = ctx.switchToHttp().getRequest();
        return key ? request.user[key] : request.user;
    },
);