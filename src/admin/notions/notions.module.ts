import { Module } from '@nestjs/common';
import { NotionsService } from './services/notions.service';
import { NotionsController } from './controllers/notions.controller';
import { NotionEntity } from './entities/notion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from '../chats/chats.module';
import { AdministratorsModule } from '../administrators/administrators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotionEntity]),
    ChatsModule,
    AdministratorsModule
  ],
  controllers: [NotionsController],
  providers: [NotionsService],
})
export class NotionsModule {}
