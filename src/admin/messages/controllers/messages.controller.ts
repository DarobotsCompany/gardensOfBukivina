import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { JwtAuthAdminGuard } from 'src/admin/auth/guards/auth-admin.guard';
import { GetMessagesQueryDto } from '../dtos/get-messages-query';

@Controller('messages')
@UseGuards(JwtAuthAdminGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    async getMessagesByChatId(@Query() query: GetMessagesQueryDto) {}

    @Post('create')
    async createMessage(@Body() dto: CreateMessageDto) {}

    @Patch('read/:messageId')
    async markMessageAsRead(@Param('messageId') messageId: string) {}
}
