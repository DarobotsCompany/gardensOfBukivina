import { Controller } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';

@Controller()
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
}
