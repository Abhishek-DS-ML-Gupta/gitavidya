import { getContext } from "./rag";
import { checkPromptSafety, askWithContext } from "@/lib/groq";
import type { ExplanationStyle } from "@/types";

export async function askQuestion(
  question: string,
  style: ExplanationStyle = "beginner"
) {
  const safety = await checkPromptSafety(question);
  if (!safety.safe) {
    return {
      answer: `I cannot process that request. ${safety.reason || "Please ask a Bhagavad Gita related question."}`,
      sources: [],
      style,
    };
  }

  const context = getContext(question);
  const answer = await askWithContext(question, context, style);

  return { answer, sources: context ? ["dataset"] : [], style };
}
