import { UserEntity } from 'src/users/entities/user.entity';
import { Context } from 'telegraf';

export interface ISessionContext extends Context {
    session: {
        user?: UserEntity;
        awaitingFullName?: boolean;
        chat?: boolean;
    };
}