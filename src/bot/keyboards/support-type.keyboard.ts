import { Markup } from "telegraf";
import { SUPPORT_TRIGGERS } from "../constants/bot-triggers";

export const supportTypeKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(
        SUPPORT_TRIGGERS.askChat.text, 
        SUPPORT_TRIGGERS.askChat.action
    )],
    [Markup.button.callback(
        SUPPORT_TRIGGERS.askCall.text, 
        SUPPORT_TRIGGERS.askCall.action
    )],
])