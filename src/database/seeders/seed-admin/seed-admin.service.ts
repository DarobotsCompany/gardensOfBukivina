import { Injectable, Logger } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import { RolesEnum } from '../../../admin/administrators/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministratorEntity } from '../../../admin/administrators/entities/administrator.entity';
import { Repository } from 'typeorm';
import * as process from 'node:process';

@Injectable()
export class SeedAdminService {
    private readonly logger = new Logger(SeedAdminService.name);
    private ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    private ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    private ADMIN_NAME = process.env.ADMIN_NAME

    constructor(
        @InjectRepository(AdministratorEntity) private readonly administratorRepository: Repository<AdministratorEntity>,
    ) {}

    async run(): Promise<void> {
        if (!this.ADMIN_EMAIL || !this.ADMIN_PASSWORD) {
            throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env');
        }

        const admin = await this.administratorRepository.findOne({
            where: { email: this.ADMIN_EMAIL },
        });

        if (!admin) {
            const password = this.hashPassword(this.ADMIN_PASSWORD);

            const newAdmin = this.administratorRepository.create({
                email: this.ADMIN_EMAIL,
                username: this.ADMIN_NAME,
                password,
                role: RolesEnum.SUPER_MANAGER,
            });

            await this.administratorRepository.save(newAdmin)

            this.logger.log('✅ Admin seeded successfully');
            return;
        }

        await this.administratorRepository.update(admin.id, {
            role: RolesEnum.SUPER_MANAGER,
        });

        this.logger.log('✅ Admin updated successfully');
    }

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10));
    }
}
