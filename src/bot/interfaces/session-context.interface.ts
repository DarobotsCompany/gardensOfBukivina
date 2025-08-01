import { TicketType } from 'src/common/enums/ticket-type.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { Context } from 'telegraf';

export interface ISessionContext extends Context {
    session: {
        user?: UserEntity;
        awaitingFullName?: boolean;
        chat?: boolean;
        call?: boolean;
        typeTicketCall?: TicketType;
        typeTicketChat?: TicketType
    };
}