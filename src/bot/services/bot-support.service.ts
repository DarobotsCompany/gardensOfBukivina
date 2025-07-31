import { Injectable, Logger } from '@nestjs/common';
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
import { ChatStatus } from 'src/admin/chats/enums/chat-status.enum';
import { Not } from 'typeorm';
import { MessageEntity } from 'src/admin/messages/entities/message.entity';
import { ChatEntity } from 'src/admin/chats/entities/chat.entity';

@Update()
@Injectable()
export class BotSupportService {
    private readonly logger = new Logger(BotSupportService.name, { timestamp: true });

    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly usersService: UsersService,
        private readonly chatService: ChatsService,
        private readonly messagesService: MessagesService,
        private readonly chatGateway: ChatGateway,
    ) {}

    async writeMessage(ctx: ISessionContext): Promise<void> {
        const telegramId = ctx.from?.id;
        const text = ctx.text;

        this.logger.debug('Получено сообщение:', text, 'от пользователя:', telegramId);

        const user = await this.usersService.getUser({
            where: { telegramId },
        });

        if (!user || !text) return;

        this.logger.debug(`Пользователь ${user.username} найден в базе данных.`);

        let chat = await this.chatService.getChat({
            where: {
                user: { telegramId },
                status: Not(ChatStatus.COMPLETE)
            },
            relations: ['user']
        });

        if (!chat) {
            chat = await this.chatService.createChat({ user });
        }

        const message = await this.messagesService.createMessageAsTelegramUser({
            chat, user, text
        });

        const [lastMessage, unreadCount] = await Promise.all([
            this.messagesService.getLastMessageByChatId(chat.id),
            this.messagesService.countUnreadMessages(chat.id),
        ]);

        await this.onTelegramMessageReceived(chat, message, lastMessage, unreadCount);
    }

    private async onTelegramMessageReceived(
        chat: ChatEntity,
        message: MessageEntity,
        lastMessage?: MessageEntity | null,
        unreadCount?: number
    ): Promise<void> {
        const adminId = chat.administrator?.id ?? null;

        const roomName = new BuildRoomId(String(message.user?.telegramId)).getRoomName;
        const generalRoomName = adminId ? new BuildGeneralRoomId(adminId).getRoomName : NEW_FOR_ALL_ROOM;

        this.chatGateway.server.to(generalRoomName).emit('newMessage', {
            chatId: chat.id,
            lastMessage,
            unreadCount,
        });

        this.chatGateway.server.to(roomName).emit('newMessage', message);
    }
}

