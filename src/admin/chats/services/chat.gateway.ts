import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { IAdminJwtPayload } from '../../auth/interfaces/admin-jwt-payload.interface';
import { BuildRoomId } from '../utils/build-room-name';
import { BuildGeneralRoomId } from '../utils/build-generalroom-name';
import { NEW_FOR_ALL_ROOM } from '../constants/chat-all.constants';
import { JwtWsGuard } from '../guards/jwt-ws-guard';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*', }})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(ChatGateway.name, { timestamp: true });

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    afterInit(server: Server) {
        this.logger.debug('✅ WebSocket сервер ініціалізовано');
    }

    @UseGuards(JwtWsGuard)
    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.headers.authorization as string;

            if (!token) throw new UnauthorizedException('Токен відсутній');

            const jwtPayload: IAdminJwtPayload = this.jwtService.verify(token, {
                secret: process.env.JWT_ADMIN_SECRET,
            });

            const generalRoomName = new BuildGeneralRoomId(jwtPayload.id).getRoomName;
            const newForAllRoom = NEW_FOR_ALL_ROOM;

            client.join(generalRoomName);
            client.join(newForAllRoom);
            this.logger.debug(`🔗 Користувач ${jwtPayload.email} підключився до загальної кімнати ${generalRoomName} та кімнати для всіх ${newForAllRoom}`);
        } catch (err) {
            this.logger.error('❌ Помилка аутентифікації WebSocket:', err.message);
            client.disconnect();
        }
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage('joinPersonalRoom')
    handleJoinPersonalRoom(client: Socket, payload: { telegramId: string }) {
        const roomName = new BuildRoomId(payload.telegramId).getRoomName;
        client.join(roomName);
        this.logger.debug(`👤 ${client.data.user?.email} приєднався до персональної кімнати ${roomName}`);
    }

    handleDisconnect(client: Socket) {
        if (client.data.user) {
            this.logger.debug(`🔌 Користувач ${client.data.user.username} відключився`);
        }
    }

    @SubscribeMessage('newMessage')
    async handleMessage(client: Socket, payload: { roomId: number; message: string }) {
        const roomName = 'room' + payload.roomId;
        this.logger.debug(`✉️ Повідомлення від ${client.data.user.username} в ${roomName}: ${payload.message}`);

        this.server.to(roomName).emit('newMessage', {
            from: client.data.user.username,
            message: payload.message,
            sentAt: new Date().toISOString(),
        });
    }
}
