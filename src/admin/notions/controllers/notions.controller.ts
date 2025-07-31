import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { NotionsService } from '../services/notions.service';
import { NotionEntity } from '../entities/notion.entity';
import { GetNotionsQuery } from '../dtos/get-notions.dto';
import { CreateNotionDto } from '../dtos/create-notion.dto';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { Admin } from 'src/common/decorators/admin.decorator';
import { IAdminJwtPayload } from 'src/admin/auth/interfaces/admin-jwt-payload.interface';
import { UpdateNotionDto } from '../dtos/update-notion.dto';

@Controller()
export class NotionsController {
    constructor(private readonly notionsService: NotionsService) {}

    @Get(':chatId')
    async getAllChatNotions(@Query() query: GetNotionsQuery): Promise<IGetDataPages<NotionEntity>> {
        return this.notionsService.getAllChatNotions(query);
    }

    @Post('create')
    async createnotion(@Body() dto: CreateNotionDto, @Admin() admin: IAdminJwtPayload): Promise<NotionEntity> {
        return this.notionsService.createNotion(dto, admin.id);
    }

    @Patch(':id')
    async updateNotion(
        @Param('id') id: number, 
        @Body() dto: UpdateNotionDto,
        @Admin() admin: IAdminJwtPayload
    ): Promise<NotionEntity> {
        return this.notionsService.updateNotion(id, dto, admin);
    }
}
