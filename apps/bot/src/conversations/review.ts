import { Conversation } from "@grammyjs/conversations";
import { prisma } from "@dayforge/db";

import { MyContext } from "../types/context.js";
import { askText } from "./helpers.js";
import { todayDate } from "@dayforge/shared";

function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function parseBoolean(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return ["yes", "y", "true", "done", "completed"].includes(normalized);
}

export async function reviewConversation(
  conversation: Conversation<MyContext>,
  ctx: MyContext
) {
  const productivity = await askText(
    conversation,
    ctx,
    "Productivity score today? (1-10)"
  );

  const energy = await askText(
    conversation,
    ctx,
    "Energy score today? (1-10)"
  );

  const mood = await askText(
    conversation,
    ctx,
    "Mood score today? (1-10)"
  );

  const biggestWin = await askText(
    conversation,
    ctx,
    "Biggest win today?"
  );

  const blocker = await askText(
    conversation,
    ctx,
    "Biggest blocker or failure today?"
  );

  const moneyMade = await askText(
    conversation,
    ctx,
    "Money made today?"
  );

  const moneySpent = await askText(
    conversation,
    ctx,
    "Money spent today?"
  );

  const studyHours = await askText(
    conversation,
    ctx,
    "Study hours today?"
  );

  const gymDone = await askText(
    conversation,
    ctx,
    "Gym done today? yes/no"
  );

  const user = await prisma.user.findUnique({
    where: {
      telegramId: String(ctx.from?.id)
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const date = todayDate();

  await prisma.dailyReview.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date
      }
    },
    update: {
      productivityScore: parseNumber(productivity),
      energyScore: parseNumber(energy),
      moodScore: parseNumber(mood),
      biggestWin,
      blocker,
      moneyMade: parseNumber(moneyMade),
      moneySpent: parseNumber(moneySpent),
      studyHours: parseNumber(studyHours),
      gymDone: parseBoolean(gymDone)
    },
    create: {
      userId: user.id,
      date,
      productivityScore: parseNumber(productivity),
      energyScore: parseNumber(energy),
      moodScore: parseNumber(mood),
      biggestWin,
      blocker,
      moneyMade: parseNumber(moneyMade),
      moneySpent: parseNumber(moneySpent),
      studyHours: parseNumber(studyHours),
      gymDone: parseBoolean(gymDone)
    }
  });

  await ctx.reply(
    [
      "Day reviewed.",
      "",
      `Productivity: ${productivity}/10`,
      `Energy: ${energy}/10`,
      `Mood: ${mood}/10`,
      "",
      `Win: ${biggestWin}`,
      `Blocker: ${blocker}`,
      "",
      `Money made: ${moneyMade}`,
      `Money spent: ${moneySpent}`,
      `Study: ${studyHours} hours`,
      `Gym: ${gymDone}`
    ].join("\n")
  );
}