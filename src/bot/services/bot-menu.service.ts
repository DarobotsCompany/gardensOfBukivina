import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { ISessionContext } from '../interfaces/session-context.interface';
import { MENU_TRIGGERS } from '../constants/bot-triggers';
import { Context, Telegraf } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { supportTypeKeyboard } from '../keyboards/support-type.keyboard';

@Update()
@Injectable()
export class BotMenuService {
    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
    ) {}

    @Hears(MENU_TRIGGERS.editorChoice)
    async onEditorChoice(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Тут буде вибір редакції 📚');
    }

    @Hears(MENU_TRIGGERS.searchByName)
    async onSearchByName(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Введіть назву товару для пошуку 🔎');
    }

    @Hears(MENU_TRIGGERS.cart)
    async onCart(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Ваш кошик порожній 🛒');
    }

    @Hears(MENU_TRIGGERS.orders)
    async onOrders(@Ctx() ctx: ISessionContext) {
        await ctx.reply('У вас поки що немає замовлень 📦');
    }

    @Hears(MENU_TRIGGERS.info)
    async onInfo(@Ctx() ctx: ISessionContext) {
        await ctx.reply('Інформація про сервіс ⚠️🖋');
    }

    @Hears(MENU_TRIGGERS.support)
    async onSupport(@Ctx() ctx: ISessionContext) {
        await ctx.reply(
            'Ви можете зателефонувати нам за номером, або написати своє звернення, чи замовте дзвінок ⬇️',
            supportTypeKeyboard
        );
    }
}
