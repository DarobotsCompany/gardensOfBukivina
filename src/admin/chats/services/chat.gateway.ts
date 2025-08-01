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
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: { origin: '*', }})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(ChatGateway.name, { timestamp: true });

    constructor(
        private readonly jwtService: JwtService,
        private readonly chatsService: ChatsService
    ) {}

    afterInit(server: Server) {
        this.logger.debug('✅ WebSocket сервер ініціалізовано');
    }

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
    async handleJoinPersonalRoom(client: Socket, payload: { chatId: number }) {
        const admin = client.data.user
        const chatId = payload.chatId

        const chat = await this.chatsService.getChat({
            where: { id: chatId },
            relations: ['user']
        })

        if (!chat) return;

        const telegramId = chat.user.telegramId
        const roomName = new BuildRoomId(telegramId).getRoomName;
        client.join(roomName);
        await this.chatsService.joinNotificateUser(chat, admin)
        this.logger.debug(`👤 ${admin?.email} приєднався до персональної кімнати ${roomName}`);
    }

    handleDisconnect(client: Socket) {
        if (client.data.user) {
            this.logger.debug(`🔌 Користувач ${client.data.user.username} відключився`);
        }
    }
}
