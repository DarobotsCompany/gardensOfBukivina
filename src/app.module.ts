import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { BasketModule } from './basket/basket.module';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { BotModule } from './bot/bot.module';
import { OcstoreModule } from './ocstore/ocstore.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { NotionsModule } from './admin/notions/notions.module';

@Module({
  imports: [
    TelegramModule, 
    UsersModule, 
    BasketModule, 
    DatabaseModule, 
    AdminModule, 
    BotModule, 
    OcstoreModule,
  ],
  providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
