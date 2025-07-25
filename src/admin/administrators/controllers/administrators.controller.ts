import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdministratorsService } from '../services/administrators.service';
import { CreateAdministratorDto } from '../dto/create-administrator.dto';
import { JwtAuthAdminGuard } from '../../auth/guards/auth-admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../roles/enums/roles.enum';

@Controller()
export class AdministratorsController {
    constructor(private readonly administratorsService: AdministratorsService) {}

    @UseGuards(JwtAuthAdminGuard)
    @Roles(RolesEnum.SUPPER_MANAGER)
    @Post('create')
    async createAdministrator(@Body() dto: CreateAdministratorDto) {}
}
