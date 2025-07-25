import { Module } from '@nestjs/common';
import { BotAuthService } from './services/bot-auth.service';
import { UsersModule } from '../users/users.module';
import { BotMenuService } from './services/bot-menu.service';

@Module({
    imports: [
      UsersModule
    ],
    controllers: [],
    providers: [BotAuthService, BotMenuService],
    exports: [BotAuthService],
})
export class BotModule {}
