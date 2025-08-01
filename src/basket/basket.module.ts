import { Module } from '@nestjs/common';
import { BasketService } from './services/basket.service';
import { BasketController } from './controllers/basket.controller';

@Module({
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
