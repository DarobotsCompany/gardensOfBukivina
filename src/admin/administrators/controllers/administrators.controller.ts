import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdministratorsService } from '../services/administrators.service';
import { CreateAdministratorDto } from '../dto/create-administrator.dto';
import { JwtAuthAdminGuard } from '../../auth/guards/auth-admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IMessage } from '../../../common/dtos/responses/message.interface';
import { UpdateAdministratorDto } from '../dto/update-administrator.dto';
import { AdministratorEntity } from '../entities/administrator.entity';

@Controller()
export class AdministratorsController {
    constructor(private readonly administratorsService: AdministratorsService) {}

    @UseGuards(JwtAuthAdminGuard, RolesGuard)
    @Roles(RolesEnum.SUPPER_MANAGER)
    @Get()
    async getAllAdministrators(): Promise<AdministratorEntity[]> {
        return this.administratorsService.getAllAdministrators();
    }

    @UseGuards(JwtAuthAdminGuard, RolesGuard)
    @Roles(RolesEnum.SUPPER_MANAGER)
    @Post('create')
    async createAdministrator(@Body() dto: CreateAdministratorDto): Promise<IMessage> {
        return this.administratorsService.registerAdministrator(dto);
    }

    @UseGuards(JwtAuthAdminGuard, RolesGuard)
    @Roles(RolesEnum.SUPPER_MANAGER)
    @Put('update/:id')
    async updateAdministrator(@Param('id') id: number, @Body() dto: UpdateAdministratorDto): Promise<IMessage> {
        return this.administratorsService.updateAdministrator(id, dto);
    }

    @UseGuards(JwtAuthAdminGuard, RolesGuard)
    @Roles(RolesEnum.SUPPER_MANAGER)
    @Delete('/:id')
    async deleteAdministrator(@Param('id') id: number): Promise<IMessage> {
        return this.administratorsService.deleteAdministrator(id);
    }
}
