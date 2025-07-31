import { IsNotEmpty, IsNumber, isNumber } from "class-validator";

export class OwnChatDto {

    @IsNotEmpty()
    @IsNumber()
    adminId: number;

    @IsNotEmpty()
    @IsNumber()
    chatId: number;
} 