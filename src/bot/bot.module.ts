import { Module } from '@nestjs/common';
import { BotAuthService } from './services/bot-auth.service';
import { UsersModule } from '../users/users.module';
import { BotMenuService } from './services/bot-menu.service';
import { ChatsModule } from '../admin/chats/chats.module';
import { BotSupportService } from './services/bot-support.service';
import { BotTextService } from './services/bot-text.service';

@Module({
    imports: [
        UsersModule,
        ChatsModule
    ],
    controllers: [],
    providers: [BotAuthService, BotMenuService, BotSupportService, BotTextService],
    exports: [BotAuthService, BotMenuService, BotSupportService, BotTextService]
})
export class BotModule {}
