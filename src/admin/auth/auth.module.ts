import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdministratorsModule } from '../administrators/administrators.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAdminStrategy } from './strategies/jwt-strategy';
import { JwtAuthAdminGuard } from './guards/auth-admin.guard';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_ADMIN_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        AdministratorsModule,
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtAdminStrategy,
        JwtAuthAdminGuard
    ],
})
export class AuthModule {}


