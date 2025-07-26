import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from '../../users/services/users.service';
import { ISessionContext } from '../interfaces/session-context.interface';

@Update()
@Injectable()
export class BotAuthService {
    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
        private readonly usersService: UsersService
    ) {}

    @Start()
    async start(@Ctx() ctx: ISessionContext): Promise<void> {
        const userTg = ctx.from;
        if (!userTg) return;

        const telegramId = userTg.id;

        let user = await this.usersService.getUser({ where: { telegramId } });

        const userData = {
            telegramId,
            username: userTg.username || "",
            fullName: `${userTg.first_name ?? ''} ${userTg.last_name ?? ''}`.trim(),
        };

        if (user) {
            await this.usersService.updateUser(user.id, userData);
            ctx.session.user = user;
        } else {
            const newUser = await this.usersService.createUser(userData);
            console.log(newUser)
            ctx.session.user = newUser;
        }

        await ctx.reply('Привіт! 👋 Я - твій персональний помічник для швидкого та зручного оформлення замовлень. Готові почати? Натисніть "Поділитись номером" 👇', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: '📞 Надіслати номер',
                            request_contact: true,
                        },
                    ],
                ],
                resize_keyboard: true,
            },
        });
    }

    @On('contact')
    async handleContact(@Ctx() ctx: ISessionContext): Promise<void> {
        const message = ctx.message;

        if (!message || !('contact' in message)) {
            console.warn('No contact in message');
            return;
        }

        const phone = message.contact.phone_number;
        const chatId = ctx.chat?.id;

        if (!chatId) {
            console.warn('No chat ID');
            return;
        }

        const user = ctx.session?.user;

        user && await this.usersService.updateUser(user.id, { phone });

        await ctx.telegram.sendMessage(chatId,
            '✅ Готово! Залишилось трохи інформації, щоб ми могли доставити ваше замовлення. Введіть, будь ласка, ваше імʼя та прізвище', {
            reply_markup: {
                remove_keyboard: true,
            },
        });

        ctx.session.awaitingFullName = true;
    }
}