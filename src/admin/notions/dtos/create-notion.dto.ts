import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TypeNotions } from "../enums/type-notions.enum";

export class CreateNotionDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    @IsNumber()
    chatId: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsEnum(TypeNotions)
    @IsNotEmpty()
    type: TypeNotions;
}
