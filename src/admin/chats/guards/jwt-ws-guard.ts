import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { IAdminJwtPayload } from '../../auth/interfaces/admin-jwt-payload.interface';

@Injectable()
export class JwtWsGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.headers.authorization as string;

        if (!token) throw new UnauthorizedException('Token not found');

        try {
            const payload: IAdminJwtPayload = this.jwtService.verify(token, {
                secret: process.env.JWT_ADMIN_SECRET,
            });

            client.data.user = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
