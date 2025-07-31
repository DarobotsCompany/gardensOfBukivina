import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ICreateMessage } from '../schemas/create-message.schema';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { GetMessagesQueryDto } from '../dtos/get-messages-query';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ChatsService } from 'src/admin/chats/services/chats.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { AdministratorsService } from 'src/admin/administrators/services/administrators.service';
import { ChatStatus } from 'src/admin/chats/enums/chat-status.enum';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly chatsService: ChatsService,
        private readonly administratorsService: AdministratorsService,
    ) {}

    async getMessagesByChatId(query: GetMessagesQueryDto): Promise<IGetDataPages<MessageEntity>> {
        const { chatId, take = 10, skip = 0 } = query;
        
        const [data, total] = await this.messageRepository.findAndCount({
            where: { chat: { id: chatId } },
            take,
            skip,
            relations: ['chats'],
        });

        return { data, total };
    }

    async getMessage(options: FindOneOptions<MessageEntity>): Promise<MessageEntity | null> {
        return this.messageRepository.findOne(options);
    }

    async createMessageAsTelegramUser(chatData: ICreateMessage): Promise<MessageEntity> {
        const chat = this.messageRepository.create(chatData);
        return this.messageRepository.save(chat);
    }

    async createMessageAsAdmin(dto: CreateMessageDto, adminId: number): Promise<MessageEntity> {
        const { text, chatId } = dto;
        const administrator = await this.administratorsService.getAdministrator({
            where: { id: adminId },
        });

        if (!administrator) throw new NotFoundException(`Administrator with ID ${adminId} not found`);
        
        const chat = await this.chatsService.getChat({ 
            where: { id: chatId },
            relations: ['user']
        });

        if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);

        if (chat.status === ChatStatus.COMPLETE) {
            throw new NotFoundException(`Chat with ID ${chatId} is already completed`);
        }

        const newMessage = this.messageRepository.create({
            text, chat, administrator, user: chat.user
        });

        const savedMessage = await this.messageRepository.save(newMessage)

        await this.bot.telegram.sendMessage(
            chat.user.telegramId, 
            `💬 Адміністратор ${administrator.username}: ${text}`
        );

        return savedMessage;
    }

    async getLastMessageByChatId(chatId: number): Promise<MessageEntity | null> {
        return this.messageRepository.findOne({
            where: { chat: { id: chatId } },
            order: { createdAt: 'DESC' },
        });
    }

    async countUnreadMessages(chatId: number): Promise<number> {
        return this.messageRepository.count({
            where: {
                chat: { id: chatId },
                isRead: false,
            },
        });
    }

    async markMessageAsRead(messageId: number): Promise<MessageEntity> {
        const message = await this.messageRepository.findOneBy({ id: messageId });

        if (!message) {
            throw new NotFoundException(`Message with ID ${messageId} not found`);
        }

        message.isRead = true;
        return this.messageRepository.save(message);
    }
}