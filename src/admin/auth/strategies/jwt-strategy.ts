import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as process from "process";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAdminJwtPayload } from '../interfaces/admin-jwt-payload.interface';
import { AdministratorEntity } from '../../administrators/entities/administrator.entity';
import { AdministratorsService } from '../../administrators/services/administrators.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
      private readonly administratorsService: AdministratorsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ADMIN_SECRET || (() => { throw new Error("JWT_ADMIN_SECRET is not defined"); })(),
        });
    }

    async validate(payload: IAdminJwtPayload): Promise<AdministratorEntity> {
        const { id } = payload;
        const admin = await this.administratorsService.getUser({
            where: { id },
        });

        if (!admin) {
            throw new UnauthorizedException("Invalid token.");
        }

        return admin;
    }
}