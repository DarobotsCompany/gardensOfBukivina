import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { JwtAuthAdminGuard } from 'src/admin/auth/guards/auth-admin.guard';

@Controller('messages')
@UseGuards(JwtAuthAdminGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get(':chatId')
    async getMessagesByChatId(@Param('chatId') chatId: string) {}

    @Post('create')
    async createMessage(@Body() dto: CreateMessageDto) {}

    @Patch('read/:messageId')
    async markMessageAsRead(@Param('messageId') messageId: string) {}
}
