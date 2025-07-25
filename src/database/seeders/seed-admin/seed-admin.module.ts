import { Module } from '@nestjs/common';
import { SeedAdminService } from './seed-admin.service';
import { AdministratorsModule } from '../../../admin/administrators/administrators.module';

@Module({
    imports: [AdministratorsModule],
    providers: [SeedAdminService],
    exports: [SeedAdminService]
})
export class SeedAdminModule {}
