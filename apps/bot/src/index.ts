import "dotenv/config";
import { Bot, session } from "grammy";
import {
  conversations,
  createConversation
} from "@grammyjs/conversations";

import { MyContext } from "./types/context.js";
import { planConversation } from "./conversations/plan.js";
import { reviewConversation } from "./conversations/review.js";
import { prisma } from "@dayforge/db";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing");
}

const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));

bot.use(conversations());

bot.use(createConversation(planConversation));
bot.use(createConversation(reviewConversation));

bot.use(async (ctx, next) => {
  if (ctx.from) {
    await prisma.user.upsert({
      where: {
        telegramId: String(ctx.from.id)
      },
      update: {},
      create: {
        telegramId: String(ctx.from.id),
        username: ctx.from.username,
        firstName: ctx.from.first_name
      }
    });
  }

  await next();
});

bot.command("start", async (ctx) => {
  await ctx.reply(
    [
      "Welcome to DayForge.",
      "",
      "Plan tomorrow. Review today. Track reality.",
      "",
      "Commands:",
      "/plan",
      "/review"
    ].join("\n")
  );
});

bot.command("plan", async (ctx) => {
  await ctx.conversation.enter("planConversation");
});

bot.command("review", async (ctx) => {
  await ctx.conversation.enter("reviewConversation");
});

bot.start();

console.log("DayForge bot is running.");