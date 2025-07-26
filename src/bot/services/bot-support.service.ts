import { Injectable } from '@nestjs/common';
import { InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from '../../users/services/users.service';
import { ISessionContext } from '../interfaces/session-context.interface';
import { ChatGateway } from '../../admin/chats/services/chat.gateway';

@Update()
@Injectable()
export class BotSupportService {
    constructor(
      @InjectBot('bot') private readonly bot: Telegraf<Context>,
      private readonly usersService: UsersService,
      private readonly chatGateway: ChatGateway,
    ) {}

    async writeMessage(ctx: ISessionContext) {
        console.log('Получено сообщение:', ctx.text);

        await this.onTelegramMessageReceived(1, "test", "1")
    }

    async onTelegramMessageReceived(roomId: number, text: string, fromUser: string) {
        this.chatGateway.sendMessageToRoom(roomId, {
            from: fromUser,
            message: text,
        });
    }
}