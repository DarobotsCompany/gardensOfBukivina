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
import { TicketsService } from 'src/admin/tickets/services/tickets.service';

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
        private readonly ticketsService: TicketsService
    ) {}

    async handleCall(ctx: ISessionContext): Promise<void> {
        const telegramId = ctx.from?.id;
        const text = ctx.text;
        const category = ctx.session.typeTicketCall

        if (!telegramId || !category) return;

        this.logger.debug('Обработка звонка от пользователя:', telegramId, 'сообщение:', text);

        const user = await this.usersService.getUser({
            where: { telegramId },
        });

        if (!user) {
            this.logger.warn(`Пользователь с ID ${telegramId} не найден.`);
            return;
        }

        await this.ticketsService.createTicket({
            message: text || 'Пользователь не оставил сообщение',
            user,
            category
        })

        ctx.session.call = false; 
        ctx.session.typeTicketCall = undefined
        await ctx.reply('Ваше звернення прийнято. Ми зв’яжемося з вами найближчим часом 📞');
    }

    async writeMessage(ctx: ISessionContext): Promise<void> {
        const telegramId = ctx.from?.id;
        const text = ctx.text;
        const category = ctx.session.typeTicketChat

        this.logger.debug('Получено сообщение:', text, 'от пользователя:', telegramId);

        const user = await this.usersService.getUser({
            where: { telegramId },
        });

        if (!user || !text || !category) return;
                console.log(ctx.session.typeTicketChat)


        this.logger.debug(`Пользователь ${user.username} найден в базе данных.`);

        let chat = await this.chatService.getChat({
            where: {
                user: { telegramId },
                status: Not(ChatStatus.COMPLETE)
            },
            relations: ['user']
        });

        if (!chat) {
            chat = await this.chatService.createChat({ user, category });
        }

        const message = await this.messagesService.createMessageAsTelegramUser({
            chat, user, text
        });

        const [lastMessage, unreadCount] = await Promise.all([
            this.messagesService.getLastMessageByChatId(chat.id),
            this.messagesService.countUnreadMessages(chat.id),
        ]);

        ctx.session.typeTicketChat = undefined
        await this.onTelegramMessageReceived(chat, message, lastMessage, unreadCount);
         ctx.reply("Ваше звернення передано менеджеру. Будь ласка, залишайтесь у чаті.")
    }

    private async onTelegramMessageReceived(
        chat: ChatEntity,
        message: MessageEntity,
        lastMessage?: MessageEntity | null,
        unreadCount?: number
    ): Promise<void> {
        const adminId = chat.administrator?.id ?? null;
        const telegramId = message.user?.telegramId

        if (!telegramId) {
            this.logger.error("Помилка з telegramId")
            return;
        }

        const roomName = new BuildRoomId(telegramId).getRoomName;
        const generalRoomName = adminId ? new BuildGeneralRoomId(adminId).getRoomName : NEW_FOR_ALL_ROOM;

        this.chatGateway.server.to(generalRoomName).emit('newMessage', {
            chatId: chat.id,
            lastMessage,
            unreadCount,
        });

        this.chatGateway.server.to(roomName).emit('newMessage', message);
    }
}

