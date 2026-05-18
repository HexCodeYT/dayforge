import "dotenv/config";
import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing");
}

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  await ctx.reply(
    [
      "Welcome to DayForge.",
      "",
      "Plan tomorrow. Review today. Track reality.",
      "",
      "Commands:",
      "/start - Show welcome message",
      "/plan - Plan tomorrow",
      "/review - Review today"
    ].join("\n")
  );
});

bot.command("plan", async (ctx) => {
  await ctx.reply("Planning flow coming next.");
});

bot.command("review", async (ctx) => {
  await ctx.reply("Review flow coming next.");
});

bot.start();

console.log("DayForge bot is running.");