import { Injectable } from "@nestjs/common";
import { Update, InjectBot } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";

@Update()
@Injectable()
export class BotBasketService {
    constructor(
        @InjectBot('bot') private readonly bot: Telegraf<Context>,
    ) {}
}