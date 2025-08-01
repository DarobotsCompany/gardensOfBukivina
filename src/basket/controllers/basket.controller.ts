import { Controller } from '@nestjs/common';
import { BasketService } from '../services/basket.service';

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}
}
