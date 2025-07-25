import { Module } from '@nestjs/common';
import { OcstoreService } from './ocstore.service';
import { OcstoreController } from './ocstore.controller';

@Module({
  controllers: [OcstoreController],
  providers: [OcstoreService],
})
export class OcstoreModule {}
