import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatEntity } from '../entities/chat.entity';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICteateChat } from '../schemas/create-chat.schema';
import { GetChatsQueryDto } from '../dtos/get-chats-query.dto';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { AdministratorsService } from 'src/admin/administrators/services/administrators.service';
import { ChatStatus } from '../enums/chat-status.enum';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { menuKeyboard } from 'src/bot/keyboards/menu.keyboards';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly administratorsService: AdministratorsService,
    ) {}

    async getChats(adminId: number, query: GetChatsQueryDto): Promise<IGetDataPages<ChatEntity>> {
        const { take = 10, skip = 0 } = query;

        const [data, total] = await this.chatRepository.findAndCount({
            where: [
                { administrator: { id: adminId } },
                { administrator: IsNull() },
            ],
            take,
            skip,
            relations: ['administrator'],
        });

        return { data, total };
    }

    async getChat(options: FindOneOptions<ChatEntity>): Promise<ChatEntity | null> {
        return this.chatRepository.findOne(options);
    }

    async createChat(chatData: ICteateChat): Promise<ChatEntity> {
        const chat = this.chatRepository.create(chatData);
        return this.chatRepository.save(chat);
    }

    async updateChat(chatId: number, adminId: number, dto: UpdateChatDto): Promise<ChatEntity> {
        const admin = await this.administratorsService.getAdministrator({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Administrator not found');
        }

        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['administrator', 'user'],
        });

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        chat.status = dto.status;

        if (!chat.administrator) {
            chat.administrator = admin;
        }

        if (dto.status === ChatStatus.COMPLETE) {
            await this.bot.telegram.sendMessage(
                chat.user.telegramId,
                `💬 Адміністратор ${chat.administrator.username} завершив чат. Якщо з’являться нові питання — не соромтесь писати нам 😊`,
                {
                    reply_markup: {
                        keyboard: menuKeyboard,
                        resize_keyboard: true,
                    },
                },
            );
        }

        return await this.chatRepository.save(chat);
    }

    async closeChatByTelegramId(telegramUserId: number): Promise<void> {
        const chats = await this.chatRepository.find({
            where: {
                status: Not(ChatStatus.COMPLETE),
                user: { telegramId: telegramUserId },
            },
            relations: ['user'],
        });

        for (const chat of chats) {
            chat.status = ChatStatus.COMPLETE;
            await this.chatRepository.save(chat);
        }
    }
}