import { Conversation } from "@grammyjs/conversations";
import { MyContext } from "../types/context.js";

export async function askText(
  conversation: Conversation<MyContext>,
  ctx: MyContext,
  question: string
): Promise<string> {
  await ctx.reply(question);

  const response = await conversation.waitFor("message:text");

  return response.message.text;
}