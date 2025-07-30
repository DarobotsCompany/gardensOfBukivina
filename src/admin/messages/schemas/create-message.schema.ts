import { ChatEntity } from "src/admin/chats/entities/chat.entity";
import { UserEntity } from "src/users/entities/user.entity";

export interface ICreateMessage {
    chat: ChatEntity
    user: UserEntity;
    text: string;
}