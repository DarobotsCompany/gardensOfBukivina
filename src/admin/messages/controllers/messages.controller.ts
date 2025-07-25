import { Controller } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}
}
