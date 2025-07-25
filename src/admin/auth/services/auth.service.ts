import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdministratorsService } from '../../administrators/services/administrators.service';
import { LoginDto } from '../dtos/login.dto';
import { IAccessToken } from '../interfaces/access-token.interface';
import { compareSync } from 'bcrypt';
import { AdministratorEntity } from '../../administrators/entities/administrator.entity';
import { IAdminJwtPayload } from '../interfaces/admin-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly administratorService: AdministratorsService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<IAccessToken> {
        const { email, password } = dto;
        const ERROR_MESSAGE = 'Incorrect email or password.';
        const admin = await this.administratorService.getAdministrator({ where: { email } });

        if (!admin) {
            throw new NotFoundException(ERROR_MESSAGE)
        }

        if (!compareSync(password, admin.password)) {
            throw new UnauthorizedException(ERROR_MESSAGE);
        }

        return this.generateToken(admin);
    }

    private async generateToken(admin: AdministratorEntity): Promise<IAccessToken> {
        const tokenPayload: IAdminJwtPayload = {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };

        const accessToken = this.jwtService.sign(tokenPayload);

        return { accessToken };
    }
}
