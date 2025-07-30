import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetByPaginationDto } from 'src/common/dtos/requests/get-by-pagination.dto';

export class GetMessagesQueryDto extends GetByPaginationDto {

    @IsNotEmpty()
    @IsNumber()
    chatId: number;
}