import { Injectable } from '@nestjs/common';
import { Ctx, Hears, InjectBot, On, Update } from 'nestjs-telegraf';
import { ISessionContext } from '../interfaces/session-context.interface';
import { BotTriggers } from '../constants/bot-triggers';
import { Context, Telegraf } from 'telegraf';
import { menuKeyboard } from '../keyboards/menu.keyboards';
import { ChatsService } from 'src/admin/chats/services/chats.service';

@Update()
@Injectable()
export class BotMenuService {
    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly chatsService: ChatsService
    ) {}

    @Hears(BotTriggers.editorChoice)
    async onEditorChoice(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Тут буде вибір редакції 📚');
    }

    @Hears(BotTriggers.searchByName)
    async onSearchByName(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Введіть назву товару для пошуку 🔎');
    }

    @Hears(BotTriggers.cart)
    async onCart(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Ваш кошик порожній 🛒');
    }

    @Hears(BotTriggers.orders)
    async onOrders(@Ctx() ctx: ISessionContext) {
        await ctx.reply('У вас поки що немає замовлень 📦');
    }

    @Hears(BotTriggers.help)
    async onHelp(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Як можу допомогти? 🧑‍💻');
    }

    @Hears(BotTriggers.info)
    async onInfo(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Інформація про сервіс ⚠️🖋');
    }

    @Hears(BotTriggers.support)
    async onSupport(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Напишіть нам, і ми відповімо 💬', {
            reply_markup: {
                keyboard: [[ { text: BotTriggers.completeChat }]],
                resize_keyboard: true,
            },
        });

        ctx.session.chat = true;
    }

    @Hears(BotTriggers.completeChat)
    async onEndChat(@Ctx() ctx: ISessionContext) {
        ctx.session.chat = false;
        const telegramUserId = ctx.from?.id

        if (!telegramUserId) {
            await ctx.reply('Помилка: не вдалося отримати ваш ID користувача.');
            await ctx.reply('✅ Ви у головному меню', {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                },
            });
            return
        }

        await this.chatsService.closeChatByTelegramId(telegramUserId);

        await ctx.reply('✅ Ви у головному меню', {
            reply_markup: {
                keyboard: menuKeyboard,
                resize_keyboard: true,
            },
        });
    }
}
