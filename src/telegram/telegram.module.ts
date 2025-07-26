import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import * as dotenv from 'dotenv';
import { BotModule } from '../bot/bot.module';
import { session } from 'telegraf';
import { UsersModule } from '../users/users.module';

dotenv.config();

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            botName: 'bot',
            useFactory: () => ({
                token: process.env.TG_TOKEN as string,
                include: [
                    BotModule,
                ],
                middlewares: [session()],
            }),
        }),
        BotModule,
        UsersModule
    ],
    providers: []
})
export class TelegramModule {}