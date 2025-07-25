import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { ISessionContext } from '../interfaces/session-context.interface';
import { BotTriggers } from '../constants/bot-triggers';

@Update()
@Injectable()
export class BotMenuService {
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
        await ctx.reply('Напишіть нам, і ми відповімо 💬');
    }
}
