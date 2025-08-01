import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from '../entities/ticket.entity';
import { Repository } from 'typeorm';
import { ICreateTicket } from '../schemas/create-ticket.schema';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(TicketEntity) private readonly ticketRepository: Repository<TicketEntity>
    ) {}

    async createTicket(ticketData: ICreateTicket): Promise<TicketEntity> {
        const ticket = this.ticketRepository.create(ticketData);
        return this.ticketRepository.save(ticket);
    }
}
