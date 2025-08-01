import { TicketType } from "src/common/enums/ticket-type.enum";
import { UserEntity } from "src/users/entities/user.entity";

export interface ICreateTicket {
    user: UserEntity;
    message: string;
    category: TicketType
}