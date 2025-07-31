import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
    @IsNumber()
    @IsNotEmpty()
    chatId: number;

    @IsString()
    @IsNotEmpty()
    text: string;
}