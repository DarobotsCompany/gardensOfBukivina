import { ChatStatus } from '../enums/chat-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateChatDto {
  @IsNotEmpty()
  @IsEnum(ChatStatus, { message: 'Статус чату повинен бути одним із допустимих значень' })
  status: ChatStatus;
}
