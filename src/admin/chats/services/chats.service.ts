import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatEntity } from '../entities/chat.entity';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICteateChat } from '../schemas/create-chat.schema';
import { GetChatsQueryDto } from '../dtos/get-chats-query.dto';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { UsersService } from 'src/users/services/users.service';
import { IMessage } from 'src/common/dtos/responses/message.interface';
import { AdministratorsService } from 'src/admin/administrators/services/administrators.service';
import { ChatStatus } from '../enums/chat-status.enum';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
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
            relations: ['administrator'],
        });

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        chat.status = dto.status;

        if (!chat.administrator) {
            chat.administrator = admin;
        }

        return await this.chatRepository.save(chat);
    }

    async updateChatStatus(chatId: number, status: ChatStatus): Promise<ChatEntity | null> {
        const chat = await this.chatRepository.findOne({ where: { id: chatId } });

        if (!chat) return null;

        chat.status = status;
        return this.chatRepository.save(chat);
    }
}