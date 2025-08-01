import { Action, Ctx, Hears, InjectBot, On, Update } from 'nestjs-telegraf';
import { ISessionContext } from '../interfaces/session-context.interface';
import { BotTriggers } from '../constants/bot-triggers';
import { Context, Markup, Telegraf } from 'telegraf';
import { menuKeyboard } from '../keyboards/menu.keyboards';
import { ChatsService } from 'src/admin/chats/services/chats.service';
import { Injectable } from '@nestjs/common';
import { TicketType } from 'src/common/enums/ticket-type.enum';
import { ticketCategoryKeyboard } from '../keyboards/ticket-category.keyboards';

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
        await ctx.reply(
            'Ви можете зателефонувати нам за номером, або написати своє звернення, чи замовте дзвінок ⬇️',
            Markup.inlineKeyboard([
                [Markup.button.callback(
                    BotTriggers.ticketChat.text, 
                    BotTriggers.ticketChat.action
                )],
                [Markup.button.callback(
                    BotTriggers.ticketCall.text, 
                    BotTriggers.ticketCall.action
                )],
            ])
        );
    }

    @Action(BotTriggers.ticketCall.action)
    async onTicketCall(@Ctx() ctx: ISessionContext) {
        await ctx.answerCbQuery();

        await ctx.editMessageText(
            '📂 Оберіть категорію вашого звернення:',
            ticketCategoryKeyboard(BotTriggers.callAction)
        );
    }

    @Action(BotTriggers.ticketChat.action)
    async onTicketChat(@Ctx() ctx: ISessionContext) {
        await ctx.answerCbQuery();

        await ctx.editMessageText(
            '📂 Оберіть категорію вашого звернення:',
            ticketCategoryKeyboard(BotTriggers.chatAction)
        );
    }

    @Action(`${BotTriggers.callAction}-${TicketType.TECH_ISSUE}`)
    @Action(`${BotTriggers.callAction}-${TicketType.GENERAL_QUESTION}`)
    @Action(`${BotTriggers.callAction}-${TicketType.SOCIAL_INITIATIVE}`)
    @Action(`${BotTriggers.callAction}-${TicketType.ORDER_ISSUE}`)
    async onCategoryCallSelected(@Ctx() ctx: ISessionContext) {
        const callbackQuery = ctx.callbackQuery as Extract<typeof ctx.callbackQuery, { data: string }>;
        const category = callbackQuery.data.split('-').pop() as TicketType;
        
        await ctx.answerCbQuery();
        await ctx.editMessageText('✍️ Опишіть вашу ситуацію детальніше, будь ласка.');

        ctx.session.call = true;
        ctx.session.typeTicketCall = category;
    }

    @Action(`${BotTriggers.chatAction}-${TicketType.TECH_ISSUE}`)
    @Action(`${BotTriggers.chatAction}-${TicketType.GENERAL_QUESTION}`)
    @Action(`${BotTriggers.chatAction}-${TicketType.SOCIAL_INITIATIVE}`)
    @Action(`${BotTriggers.chatAction}-${TicketType.ORDER_ISSUE}`)    async отTicketChat(@Ctx() ctx: ISessionContext) {
        const callbackQuery = ctx.callbackQuery as Extract<typeof ctx.callbackQuery, { data: string }>;
        const category = callbackQuery.data.split('-').pop() as TicketType;

        await ctx.reply('Напишіть нам, і ми відповімо 💬', {
            reply_markup: {
                keyboard: [[ { text: BotTriggers.completeChat }]],
                resize_keyboard: true,
            },
        });

        ctx.session.chat = true;
        ctx.session.typeTicketChat = category
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
