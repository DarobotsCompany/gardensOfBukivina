import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetNotionsQuery {

    @IsNumber()
    @IsOptional()
    take?: number;

    @IsNumber()
    @IsOptional()
    skip?: number;

    @IsNumber()
    @IsNotEmpty()
    chatId: number;
}