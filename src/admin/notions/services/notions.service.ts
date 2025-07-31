import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { NotionEntity } from '../entities/notion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthAdminGuard } from 'src/admin/auth/guards/auth-admin.guard';
import { IGetDataPages } from 'src/common/dtos/responses/get-data-pages.interface';
import { GetNotionsQuery } from '../dtos/get-notions.dto';
import { CreateNotionDto } from '../dtos/create-notion.dto';
import { AdministratorsService } from 'src/admin/administrators/services/administrators.service';
import { ChatsService } from 'src/admin/chats/services/chats.service';
import { UpdateNotionDto } from '../dtos/update-notion.dto';
import { IAdminJwtPayload } from 'src/admin/auth/interfaces/admin-jwt-payload.interface';
import { RolesEnum } from 'src/admin/administrators/enums/roles.enum';

@Injectable()
@UseGuards(JwtAuthAdminGuard)
export class NotionsService {
    constructor(
        @InjectRepository(NotionEntity) private readonly notionRepository: Repository<NotionEntity>,
        private readonly administratorsService: AdministratorsService,
        private readonly chatsService: ChatsService
    ) {}

    async getAllChatNotions(query: GetNotionsQuery): Promise<IGetDataPages<NotionEntity>> {
        const { chatId, take = 10, skip = 0 } = query;

        const [data, total] = await this.notionRepository.findAndCount({ 
            where: { chat: { id: chatId } },
            take,
            skip, 
        });

        return { data, total };
    }

    async createNotion(dto: CreateNotionDto, adminId: number): Promise<NotionEntity> {
        const { text, chatId, imageUrl, type } = dto;

        const chat = await this.chatsService.getChat({ where: { id: chatId } });

        if (!chat) {
            throw new NotFoundException(`Чат з id ${chatId} не знайдено`);
        }

        const admin = await this.administratorsService.getAdministrator({ where: { id: adminId } });

        if (!admin) {
            throw new NotFoundException(`Адміністратор з id ${adminId} не знайдений`);
        }

        const notion = this.notionRepository.create({
            text,
            chat,
            administrator: admin,
            attachments: imageUrl ?? undefined,
            type,
        });

        return await this.notionRepository.save(notion);
    }


    async updateNotion(id: number, dto: UpdateNotionDto, admin: IAdminJwtPayload): Promise<NotionEntity> {
        const notion = await this.notionRepository.findOne({
            where: { id },
            relations: ['chat', 'administrator'],
        });

        if (!notion) {
            throw new NotFoundException(`Нотатку з id ${id} не знайдено`);
        }

        if (notion.administrator.id !== admin.id && admin.role !== RolesEnum.SUPER_MANAGER) {
            throw new UnauthorizedException('Ви не маєте прав для редагування цієї нотатки');
        }

        if (dto.text !== undefined) notion.text = dto.text;
        if (dto.imageUrl !== undefined) notion.attachments = dto.imageUrl;
        if (dto.type !== undefined) notion.type = dto.type;

        return await this.notionRepository.save(notion);
    }
}
