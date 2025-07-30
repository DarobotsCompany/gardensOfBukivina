import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { JwtAuthAdminGuard } from 'src/admin/auth/guards/auth-admin.guard';
import { Admin } from 'src/common/decorators/admin.decorator';
import { IAdminJwtPayload } from 'src/admin/auth/interfaces/admin-jwt-payload.interface';
import { GetChatsQueryDto } from '../dtos/get-chats-query.dto';
import { ChatEntity } from '../entities/chat.entity';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { UpdateChatDto } from '../dtos/update-chat.dto';

@Controller()
@UseGuards(JwtAuthAdminGuard)
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Get()
    async getChats(
        @Query() query: GetChatsQueryDto, 
        @Admin() admin: IAdminJwtPayload
    ):Promise<IGetDataPages<ChatEntity>> {
        return this.chatsService.getChats(admin.id, query);
    }

    @Patch('update/:chatId')
    async takeChat(
        @Param('chatId') chatId: number,
        @Body() dto: UpdateChatDto, 
        @Admin() admin: IAdminJwtPayload
    ): Promise<ChatEntity> {
        return this.chatsService.updateChat(chatId, admin.id, dto);
    }
}