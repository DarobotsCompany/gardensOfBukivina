import { Module } from '@nestjs/common';
import { BotAuthService } from './services/bot-auth.service';
import { UsersModule } from '../users/users.module';
import { BotMenuService } from './services/bot-menu.service';
import { ChatsModule } from '../admin/chats/chats.module';
import { BotSupportService } from './services/bot-support.service';
import { BotTextService } from './services/bot-text.service';
import { MessagesModule } from '../admin/messages/messages.module';
import { TicketsModule } from 'src/admin/tickets/tickets.module';
import { BotInfoService } from './services/bot-info.service';
import { BotBasketService } from './services/bot-basket.service';
import { BotProductsService } from './services/bot-products.service';

@Module({
    imports: [
        UsersModule,
        ChatsModule,
        MessagesModule,
        TicketsModule
    ],
    controllers: [],
    providers: [
        BotAuthService, 
        BotMenuService, 
        BotSupportService, 
        BotTextService,
        BotInfoService,
        BotBasketService,
        BotProductsService
    ],
    exports: [
        BotAuthService, 
        BotMenuService, 
        BotSupportService, 
        BotTextService,
        BotInfoService,
        BotBasketService,
        BotProductsService
    ]
})
export class BotModule {}
