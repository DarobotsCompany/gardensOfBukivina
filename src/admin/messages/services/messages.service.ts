import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ICreateMessage } from '../schemas/create-message.schema';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    ) {}

    async getMessage(options: FindOneOptions<MessageEntity>): Promise<MessageEntity | null> {
        return this.messageRepository.findOne(options);
    }

    async createMessage(chatData: ICreateMessage): Promise<MessageEntity> {
        const chat = this.messageRepository.create(chatData);
        return this.messageRepository.save(chat);
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
}