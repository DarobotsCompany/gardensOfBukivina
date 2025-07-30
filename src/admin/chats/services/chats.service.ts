import { Injectable } from '@nestjs/common';
import { ChatEntity } from '../entities/chat.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICteateChat } from '../schemas/create-chat.schema';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
    ) {}

    async getChat(options: FindOneOptions<ChatEntity>): Promise<ChatEntity | null> {
        return this.chatRepository.findOne(options);
    }

    async createChat(chatData: ICteateChat): Promise<ChatEntity> {
        const chat = this.chatRepository.create(chatData);
        return this.chatRepository.save(chat);
    }
}