import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { JwtAuthAdminGuard } from 'src/admin/auth/guards/auth-admin.guard';
import { GetMessagesQueryDto } from '../dtos/get-messages-query';
import { Admin } from 'src/common/decorators/admin.decorator';
import { IAdminJwtPayload } from 'src/admin/auth/interfaces/admin-jwt-payload.interface';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { MessageEntity } from '../entities/message.entity';

@Controller()
@UseGuards(JwtAuthAdminGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    async getMessagesByChatId(@Query() query: GetMessagesQueryDto): Promise<IGetDataPages<MessageEntity>> {
        return this.messagesService.getMessagesByChatId(query);
    }

    @Post('create')
    async createMessage(
        @Body() dto: CreateMessageDto, 
        @Admin() admin: IAdminJwtPayload
    ): Promise<MessageEntity> {
        return this.messagesService.createMessageAsAdmin(dto, admin.id);
    }

    @Patch('read/:messageId')
    async markMessageAsRead(@Param('messageId') messageId: number): Promise<MessageEntity> {
        return this.messagesService.markMessageAsRead(messageId);
    }
}
