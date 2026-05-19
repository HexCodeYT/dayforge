import { prisma } from "@dayforge/db";
import { MyContext } from "../types/context.js";
import { todayDate } from "@dayforge/shared";

export async function todayCommand(ctx: MyContext) {
  const telegramId = String(ctx.from?.id);

  const user = await prisma.user.findUnique({
    where: {
      telegramId
    }
  });

  if (!user) {
    await ctx.reply("User not found.");
    return;
  }

  const date = todayDate();

  const plan = await prisma.dailyPlan.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date
      }
    }
  });

  const review = await prisma.dailyReview.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date
      }
    }
  });

  const sections: string[] = [];

  sections.push("DayForge Today");
  sections.push("");

  if (plan) {
    sections.push("PLAN");
    sections.push(`1. ${plan.priority1}`);
    sections.push(`2. ${plan.priority2}`);
    sections.push(`3. ${plan.priority3}`);

    if (plan.wakeTime) {
      sections.push(`Wake: ${plan.wakeTime}`);
    }

    sections.push("");
  }

  if (review) {
    sections.push("REVIEW");
    sections.push(
      `Productivity: ${review.productivityScore}/10`
    );

    sections.push(`Energy: ${review.energyScore}/10`);
    sections.push(`Mood: ${review.moodScore}/10`);

    sections.push("");

    sections.push(`Win: ${review.biggestWin}`);
    sections.push(`Blocker: ${review.blocker}`);

    sections.push("");

    sections.push(`Money made: $${review.moneyMade}`);
    sections.push(`Money spent: $${review.moneySpent}`);
    sections.push(`Study hours: ${review.studyHours}`);
    sections.push(`Gym: ${review.gymDone ? "Yes" : "No"}`);
  }

  if (!plan && !review) {
    sections.push("No entries found for today.");
  }

  await ctx.reply(sections.join("\n"));
}