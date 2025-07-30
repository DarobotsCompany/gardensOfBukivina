import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetByPaginationDto {
  @IsOptional()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @Type(() => Number)
  skip?: number;
}
