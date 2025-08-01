import { Module } from '@nestjs/common';
import { TicketsService } from './services/tickets.service';
import { TicketEntity } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './controllers/tickets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
