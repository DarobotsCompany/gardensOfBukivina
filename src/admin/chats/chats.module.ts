import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsController } from './controllers/chats.controller';
import { ChatGateway } from './services/chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { MessagesModule } from '../messages/messages.module';
import { ChatEntity } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtWsGuard } from './guards/jwt-ws-guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatEntity]),
        MessagesModule,
    ],
    controllers: [ChatsController],
    providers: [ChatsService, ChatGateway, JwtService, JwtWsGuard],
    exports: [ChatGateway, ChatsService]
})
export class ChatsModule {}
