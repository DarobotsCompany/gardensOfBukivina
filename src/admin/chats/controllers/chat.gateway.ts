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

@WebSocketGateway({ cors: { origin: '*', }})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
      private readonly jwtService: JwtService,
    ) {}

    afterInit(server: Server) {
        console.log('✅ WebSocket сервер ініціалізовано');
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.query.token as string;
            if (!token) throw new Error('Токен відсутній');

            const payload: IAdminJwtPayload = this.jwtService.verify(token, {
                secret: process.env.JWT_ADMIN_SECRET,
            });

            client.data.user = payload;
            const roomName = 'room1';
            client.join(roomName);
            console.log(`👤 ${payload.username} автоматично приєднався до кімнати ${roomName}`);

        } catch (err) {
            console.log('❌ Помилка аутентифікації WebSocket:', err.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        if (client.data.user) {
            console.log(`🔌 Користувач ${client.data.user.username} відключився`);
        }
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, roomId: number) {
        const roomName = 'room' + roomId;
        client.leave(roomName);
        console.log(`👤 ${client.data.user.username} вийшов з кімнати ${roomName}`);
    }

    @SubscribeMessage('newMessage')
    async handleMessage(client: Socket, payload: { roomId: number; message: string }) {
        const roomName = 'room' + payload.roomId;
        console.log(`✉️ Повідомлення від ${client.data.user.username} в ${roomName}: ${payload.message}`);

        this.server.to(roomName).emit('newMessage', {
            from: client.data.user.username,
            message: payload.message,
            sentAt: new Date().toISOString(),
        });
    }

    sendMessageToRoom(roomId: number, message: { from: string; message: string }) {
        const roomName = 'room' + roomId;
        this.server.to(roomName).emit('newMessage', {
            from: message.from,
            message: message.message,
            sentAt: new Date().toISOString(),
        });
    }
}
