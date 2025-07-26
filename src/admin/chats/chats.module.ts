import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsController } from './controllers/chats.controller';
import { ChatGateway } from './controllers/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MessagesModule } from '../messages/messages.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MessagesModule,
    ],
    controllers: [ChatsController],
    providers: [ChatsService, ChatGateway, JwtService],
    exports: [ChatGateway]
})
export class ChatsModule {}
