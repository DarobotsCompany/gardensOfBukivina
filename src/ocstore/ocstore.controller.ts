import { Controller } from '@nestjs/common';
import { OcstoreService } from './ocstore.service';

@Controller('ocstore')
export class OcstoreController {
  constructor(private readonly ocstoreService: OcstoreService) {}
}
