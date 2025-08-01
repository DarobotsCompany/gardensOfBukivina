import { TicketType } from "src/common/enums/ticket-type.enum";
import { Markup } from "telegraf";

export const ticketCategoryKeyboard = (action: string) => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🛠 Технічна проблема', `${action}-${TicketType.TECH_ISSUE}`)],
        [Markup.button.callback('❓ Загальне питання', `${action}-${TicketType.GENERAL_QUESTION}`)],
        [Markup.button.callback('🤝 Соціальна ініціатива', `${action}-${TicketType.SOCIAL_INITIATIVE}`)],
        [Markup.button.callback('📦 Проблема з замовленням', `${action}-${TicketType.ORDER_ISSUE}`)],
    ]);
};