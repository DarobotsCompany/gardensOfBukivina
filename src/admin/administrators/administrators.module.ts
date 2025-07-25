import { Module } from '@nestjs/common';
import { AdministratorsService } from './services/administrators.service';
import { AdministratorsController } from './controllers/administrators.controller';
import { AdministratorEntity } from './entities/administrator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([AdministratorEntity])],
    controllers: [AdministratorsController],
    providers: [AdministratorsService],
    exports: [TypeOrmModule, AdministratorsService]
})
export class AdministratorsModule {}
