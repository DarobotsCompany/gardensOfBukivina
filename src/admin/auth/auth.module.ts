import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AdministratorsModule } from '../administrators/administrators.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAdminStrategy } from './strategies/jwt-strategy';
import { JwtAuthAdminGuard } from './guards/auth-admin.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        AdministratorsModule,
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtAdminStrategy,
        JwtAuthAdminGuard,
        RolesGuard
    ],
})
export class AuthModule {}


