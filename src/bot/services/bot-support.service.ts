import { Injectable } from '@nestjs/common';
import { InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from '../../users/services/users.service';
import { ISessionContext } from '../interfaces/session-context.interface';
import { ChatGateway } from '../../admin/chats/services/chat.gateway';
import { ChatsService } from '../../admin/chats/services/chats.service';
import { MessagesService } from '../../admin/messages/services/messages.service';
import { BuildRoomId } from 'src/admin/chats/utils/build-room-name';
import { BuildGeneralRoomId } from 'src/admin/chats/utils/build-generalroom-name';
import { NEW_FOR_ALL_ROOM } from 'src/admin/chats/constants/chat-all.constants';

@Update()
@Injectable()
export class BotSupportService {
    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly usersService: UsersService,
        private readonly chatService: ChatsService,
        private readonly messagesService: MessagesService,
        private readonly chatGateway: ChatGateway,
    ) {}

    async writeMessage(ctx: ISessionContext) {
        console.log('Получено сообщение:', ctx.text, 'от пользователя:', ctx.from?.id);

        ctx.from?.id && ctx.text && await this.onTelegramMessageReceived(ctx.text, ctx.from?.id, 1)
    }

    async onTelegramMessageReceived(text: string, fromUser: number, toAdminId?: number) {
        const roomName = new BuildRoomId(String(fromUser)).getRoomName;
        const generalRoomName = toAdminId ? new BuildGeneralRoomId(toAdminId).getRoomName : NEW_FOR_ALL_ROOM;
    
        const messagePayload = {
            from: fromUser,
            message: text,
            sentAt: new Date().toISOString(),
        };

        this.chatGateway.server.to(generalRoomName).emit('newMessage', {...messagePayload, name: "list"});
        this.chatGateway.server.to(roomName).emit('newMessage', {...messagePayload, name: "new message"});
    }
}