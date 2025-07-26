import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessageEntity) private readonly chatRepository: Repository<MessageEntity>,
    ) {}
}
