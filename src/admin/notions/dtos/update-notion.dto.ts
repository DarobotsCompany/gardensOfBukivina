import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeNotions } from '../enums/type-notions.enum';

export class UpdateNotionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    text?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(TypeNotions)
    type?: TypeNotions;
}
