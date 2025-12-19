import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    // Initialize Gemini - using free tier
    // Get your free API key from: https://makersuite.google.com/app/apikey
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "your_api_key_here") {
      // Fallback: simple keyword matching if no API key
      const userLower = userAnswer.toLowerCase().trim();
      const correctLower = correctMeaning.toLowerCase().trim();
      
      if (userLower === correctLower) {
        return NextResponse.json({ isCorrect: true });
      }
      
      // Basic keyword overlap as fallback
      const userWords = userLower.split(/\s+/).filter((w: string) => w.length > 2);
      const correctWords = correctLower.split(/\s+/).filter((w: string) => w.length > 2);
      const stopWords = new Set(["the", "a", "an", "to", "in", "on", "at", "for", "of", "with", "by", "and", "or", "but"]);
      const userKeywords = userWords.filter((w: string) => !stopWords.has(w));
      const correctKeywords = correctWords.filter((w: string) => !stopWords.has(w));
      const overlap = userKeywords.filter((w: string) => correctKeywords.includes(w));
      const isCorrect = overlap.length >= Math.ceil(correctKeywords.length * 0.6);
      
      return NextResponse.json({ isCorrect });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-flash-latest (free tier model)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are evaluating if a student's answer correctly explains the meaning of an English idiom.

CORRECT MEANING: "${correctMeaning}"
STUDENT'S ANSWER: "${userAnswer}"

TASK: Determine if the student's answer expresses the SAME CORE MEANING as the correct answer.

CRITICAL RULES - BE VERY LENIENT:
1. Accept answers that capture the ESSENTIAL CONCEPT, even if worded differently
2. Accept shortened, simplified, or paraphrased versions
3. Accept synonyms and equivalent phrases
4. Focus on SEMANTIC MEANING, not exact wording
5. If the student understands the core idea, mark as CORRECT

SPECIFIC EXAMPLES THAT MUST BE TRUE:
- "it is your turn to make a decision" = "my turn" → TRUE (captures "turn/decision" concept)
- "it is your turn to make a decision" = "your turn" → TRUE
- "to be pursuing the wrong course of action; to be mistaken" = "bad decision" → TRUE (bad decision = wrong/mistaken)
- "to be pursuing the wrong course of action; to be mistaken" = "wrong choice" → TRUE
- "to be pursuing the wrong course of action; to be mistaken" = "making a mistake" → TRUE
- "to initiate conversation" = "start talking" → TRUE
- "very rarely" = "almost never" → TRUE
- "very expensive" = "costs a lot" → TRUE

EXAMPLES THAT MUST BE FALSE:
- "it is your turn to make a decision" = "play tennis" → FALSE (completely different)
- "very rarely" = "very often" → FALSE (opposite meaning)
- "to be mistaken" = "to be correct" → FALSE (opposite)

IMPORTANT: For "barking up the wrong tree" meaning "to be pursuing the wrong course of action; to be mistaken":
- "bad decision" = TRUE (bad decision implies wrong/mistaken)
- "wrong choice" = TRUE
- "mistake" = TRUE
- "being wrong" = TRUE
- "incorrect" = TRUE

Respond with ONLY the word "true" if the meanings match, or "false" if they don't. No other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    // Log the response for debugging
    console.log("Gemini response:", text);
    console.log("User answer:", userAnswer);
    console.log("Correct meaning:", correctMeaning);

    // Parse the response - be very flexible
    // Look for "true" anywhere, but prioritize clear "false"
    let isCorrect = false;
    
    if (text.includes("false") && !text.includes("true")) {
      isCorrect = false;
    } else if (text.includes("true")) {
      isCorrect = true;
    } else if (text.includes("yes") && !text.includes("no")) {
      isCorrect = true;
    } else if (text.includes("correct")) {
      isCorrect = true;
    } else {
      // If unclear, default to false but log it
      console.warn("Unclear Gemini response, defaulting to false");
      isCorrect = false;
    }

    return NextResponse.json({ isCorrect });
  } catch (error: any) {
    console.error("Error checking meaning:", error);
    
    // If it's a model error (404) or API key error, fall back to keyword matching
    if (error?.status === 404 || 
        error?.message?.includes("404") || 
        error?.message?.includes("not found") ||
        error?.message?.includes("API_KEY") || 
        error?.message?.includes("401") || 
        error?.message?.includes("403")) {
      console.log("API/model error, falling back to enhanced keyword matching");
      const userLower = userAnswer.toLowerCase().trim();
      const correctLower = correctMeaning.toLowerCase().trim();
      
      if (userLower === correctLower) {
        return NextResponse.json({ isCorrect: true });
      }
      
      // Enhanced keyword matching with semantic checks
      const userWords = userLower.split(/\s+/).filter((w: string) => w.length > 2);
      const correctWords = correctLower.split(/\s+/).filter((w: string) => w.length > 2);
      const stopWords = new Set(["the", "a", "an", "to", "in", "on", "at", "for", "of", "with", "by", "and", "or", "but", "is", "are", "was", "were"]);
      const userKeywords = userWords.filter((w: string) => !stopWords.has(w));
      const correctKeywords = correctWords.filter((w: string) => !stopWords.has(w));
      
      // Check for keyword overlap
      const overlap = userKeywords.filter((w: string) => correctKeywords.includes(w));
      
      // Also check if user answer contains key concepts from correct answer
      const keyConcepts = correctKeywords.filter((w: string) => w.length > 4);
      const hasKeyConcepts = keyConcepts.some((concept: string) => 
        userLower.includes(concept) || userLower.includes(concept.substring(0, 4))
      );
      
      // Be more lenient: accept if there's overlap OR if key concepts are present
      const isCorrect = overlap.length >= Math.ceil(correctKeywords.length * 0.5) || 
                       (hasKeyConcepts && userKeywords.length > 0);
      
      return NextResponse.json({ isCorrect });
    }
    
    return NextResponse.json(
      { error: "Failed to check meaning", isCorrect: false },
      { status: 500 }
    );
  }
}

