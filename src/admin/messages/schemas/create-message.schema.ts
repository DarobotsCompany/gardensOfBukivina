import { ChatEntity } from "src/admin/chats/entities/chat.entity";
import { TicketType } from "src/common/enums/ticket-type.enum";
import { UserEntity } from "src/users/entities/user.entity";

export interface ICreateMessage {
    chat: ChatEntity
    user: UserEntity;
    text: string;
}