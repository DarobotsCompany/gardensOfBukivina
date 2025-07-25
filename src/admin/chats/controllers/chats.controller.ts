import { Controller } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}
}
