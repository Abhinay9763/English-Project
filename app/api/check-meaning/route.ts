import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  // Parse request body once at the start
  const body = await request.json();
  const { userAnswer, correctMeaning } = body;

  if (!userAnswer || !correctMeaning) {
    return NextResponse.json(
      { error: "Missing userAnswer or correctMeaning" },
      { status: 400 }
    );
  }

  // Quick exact match check only
  const userLower = userAnswer.toLowerCase().trim();
  const correctLower = correctMeaning.toLowerCase().trim();

  if (userLower === correctLower) {
    return NextResponse.json({ isCorrect: true });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    // If no API key, fall back to keyword matching
    if (!apiKey) {
      console.warn("No GROQ_API_KEY found, falling back to keyword matching");
      return fallbackKeywordCheck(userAnswer, correctMeaning);
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are evaluating if a student's answer correctly explains the meaning of an English idiom.

CORRECT MEANING: "${correctMeaning}"
STUDENT'S ANSWER: "${userAnswer}"

TASK: Determine if the student's answer expresses the SAME CORE MEANING as the correct answer.

CRITICAL RULES - BE VERY LENIENT:
1. Accept answers that capture the ESSENTIAL CONCEPT, even if worded differently.
2. Accept shortened, simplified, or paraphrased versions.
3. Accept synonyms and equivalent phrases.
4. Focus on SEMANTIC MEANING, not exact wording.
5. If the student understands the core idea, mark as CORRECT.

SPECIFIC EXAMPLES:
- Correct: "to initiate conversation" | Answer: "start talking" -> TRUE
- Correct: "very rarely" | Answer: "almost never" -> TRUE
- Correct: "it is your turn to make a decision" | Answer: "my turn" -> TRUE
- Correct: "very expensive" | Answer: "costs a lot" -> TRUE

Respond with ONLY the word "true" if the meanings match, or "false" if they don't. No other text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 10,
    });

    const text = chatCompletion.choices[0]?.message?.content?.trim().toLowerCase() || "";
    const isCorrect = text.includes("true");

    return NextResponse.json({ isCorrect });

  } catch (error) {
    console.error("Error checking meaning with Groq:", error);
    return fallbackKeywordCheck(userAnswer, correctMeaning);
  }
}

function fallbackKeywordCheck(userAnswer: string, correctMeaning: string) {
  const userLower = userAnswer.toLowerCase().trim();
  const correctLower = correctMeaning.toLowerCase().trim();

  if (userLower === correctLower) {
    return NextResponse.json({ isCorrect: true });
  }

  // Enhanced keyword matching
  const userWords = userLower.split(/\s+/).filter((w: string) => w.length > 2);
  const correctWords = correctLower.split(/\s+/).filter((w: string) => w.length > 2);
  const stopWords = new Set(["the", "a", "an", "to", "in", "on", "at", "for", "of", "with", "by", "and", "or", "but", "is", "are"]);
  const userKeywords = userWords.filter((w: string) => !stopWords.has(w));
  const correctKeywords = correctWords.filter((w: string) => !stopWords.has(w));

  const overlap = userKeywords.filter((w: string) => correctKeywords.includes(w));
  const isCorrect = overlap.length >= Math.ceil(correctKeywords.length * 0.5);

  return NextResponse.json({ isCorrect });
}
