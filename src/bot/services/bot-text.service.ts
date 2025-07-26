import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from '../../users/services/users.service';
import { ISessionContext } from '../interfaces/session-context.interface';
import { BotTriggers } from '../constants/bot-triggers';
import { BotSupportService } from './bot-support.service';

@Update()
@Injectable()
export class BotTextService {
    constructor(
      @InjectBot('bot') private readonly bot: Telegraf<Context>,
      private readonly usersService: UsersService,
      private readonly botSupportService: BotSupportService
    ) {}

    @On('text')
    async handleText(@Ctx() ctx: ISessionContext): Promise<void> {
        const chatId = ctx.chat?.id;
        if (!chatId || !ctx.message || !('text' in ctx.message) || !ctx.from) return;

        if (ctx.session.awaitingFullName) {
            const fullName = ctx.message.text;
            const from = ctx.from.id;
            await this.handleAwaitingFullName(fullName, from, ctx);
        }

        if (ctx.session.chat) {
            await this.botSupportService.writeMessage(ctx);
        }
    }

    private async handleAwaitingFullName(fullName: string, from: number, ctx: ISessionContext): Promise<void> {
        const user = await this.usersService.getUser({
            where: { telegramId: from },
        });

        if (user) {
            await this.usersService.updateUser(user.id, { fullName });
        }

        ctx.session.awaitingFullName = false;
        await ctx.reply('✅ Дані збережено\nВи у головному меню', {
            reply_markup: {
                keyboard: [
                    [BotTriggers.editorChoice, BotTriggers.searchByName],
                    [BotTriggers.cart, BotTriggers.orders],
                    [BotTriggers.help, BotTriggers.info],
                    [BotTriggers.support],
                ],
                resize_keyboard: true,
            },
        });
    }
}