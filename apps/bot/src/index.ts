import "dotenv/config";
import { Bot, session } from "grammy";
import {
  conversations,
  createConversation,
  Conversation,
  ConversationFlavor
} from "@grammyjs/conversations";

type SessionData = Record<string, never>;

type MyContext = ConversationFlavor<any>;

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing");
}

const bot = new Bot<MyContext>(token);

async function planConversation(
  conversation: Conversation<MyContext>,
  ctx: MyContext
) {
  await ctx.reply("Top priority for tomorrow?");

  const priority1 = await conversation.waitFor(":text");

  await ctx.reply("Second priority?");

  const priority2 = await conversation.waitFor(":text");

  await ctx.reply("Third priority?");

  const priority3 = await conversation.waitFor(":text");

  await ctx.reply("Expected wake up time tomorrow?");

  const wakeTime = await conversation.waitFor(":text");

  await ctx.reply(
    [
      "Day planned.",
      "",
      `1. ${priority1.message.text}`,
      `2. ${priority2.message.text}`,
      `3. ${priority3.message.text}`,
      "",
      `Wake: ${wakeTime.message.text}`
    ].join("\n")
  );
}

bot.use(session({ initial: (): SessionData => ({}) }));

bot.use(conversations());
bot.use(createConversation(planConversation));

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
  await ctx.reply("Review flow coming next.");
});

bot.start();

console.log("DayForge bot is running.");