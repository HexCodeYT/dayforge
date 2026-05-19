import { Conversation } from "@grammyjs/conversations";
import { MyContext } from "../types/context.js";
import { askText } from "./helpers.js";
import { prisma } from "@dayforge/db";

export async function planConversation(
  conversation: Conversation<MyContext>,
  ctx: MyContext
) {
  const priority1 = await askText(
    conversation,
    ctx,
    "Top priority for tomorrow?"
  );

  const priority2 = await askText(
    conversation,
    ctx,
    "Second priority?"
  );

  const priority3 = await askText(
    conversation,
    ctx,
    "Third priority?"
  );

  const wakeTime = await askText(
    conversation,
    ctx,
    "Expected wake up time tomorrow?"
  );

  const user = await prisma.user.findUnique({
    where: {
      telegramId: String(ctx.from?.id)
    }
  });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  await prisma.dailyPlan.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: new Date(new Date().toDateString())
      }
    },
    update: {
      priority1,
      priority2,
      priority3,
      wakeTime
    },
    create: {
      userId: user.id,
      date: new Date(new Date().toDateString()),
      priority1,
      priority2,
      priority3,
      wakeTime
    }
  });
  
  await ctx.reply(
    [
      "Day planned.",
      "",
      `1. ${priority1}`,
      `2. ${priority2}`,
      `3. ${priority3}`,
      "",
      `Wake: ${wakeTime}`
    ].join("\n")
  );
}