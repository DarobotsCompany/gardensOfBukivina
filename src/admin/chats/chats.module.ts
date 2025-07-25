import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsController } from './controllers/chats.controller';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
