"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TextInput from "@/components/TextInput";
import idiomsData from "@/data/idiom.json";
import { useUser } from "@/components/UserContext";
import confetti from "canvas-confetti";

export default function IdiomPage() {
  // Randomly select an idiom on client-side only to avoid hydration errors
  const [idiomData, setIdiomData] = useState<{
    idiom: string;
    meaning: string;
  } | null>(null);
  const { addPoints } = useUser();

  const getRandomIdiom = () => {
    const idioms = idiomsData as Array<{
      idiom: string;
      meaning: string;
    }>;
    return idioms[Math.floor(Math.random() * idioms.length)];
  };

  useEffect(() => {
    setIdiomData(getRandomIdiom());
  }, []);

  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || submitted || isChecking || !idiomData) return;

    setIsChecking(true);

    try {
      // Quick exact match check first
      const userLower = userAnswer.toLowerCase().trim();
      const correctLower = idiomData.meaning.toLowerCase().trim();

      if (userLower === correctLower) {
        setIsCorrect(true);
        addPoints(10);
        setSubmitted(true);
        setIsChecking(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        return;
      }

      // Use Gemini AI to check semantic similarity
      const response = await fetch("/api/check-meaning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswer: userAnswer.trim(),
          correctMeaning: idiomData.meaning,
        }),
      });

      const data = await response.json();
      const correct = data.isCorrect || false;
      setIsCorrect(correct);
      if (correct) {
        addPoints(10);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Error checking answer:", error);
      // Fallback to false if API fails
      setIsCorrect(false);
      setSubmitted(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    // Get a new random idiom
    setIdiomData(getRandomIdiom());
    // Reset all game state
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setIsChecking(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rainbow-gradient opacity-10 blur-3xl"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <span className="group-hover:translate-x-[-4px] inline-block transition-transform">←</span> Back to Menu
          </Link>
          <h1 className="text-5xl md:text-6xl font-black mb-4 rainbow-text">
            Idiom of the Day
          </h1>
          <p className="text-xl text-gray-300 font-semibold">
            Guess the meaning of this English idiom
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-cyan-500/30">
          {!idiomData ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-4xl font-black text-center rainbow-text mb-4 animate-pulse">
                  "{idiomData.idiom}"
                </h2>
                <p className="text-center text-gray-300 text-lg font-semibold">
                  What does this idiom mean?
                </p>
              </div>

              {!submitted ? (
                <div className="space-y-6">
                  <TextInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    onSubmit={handleSubmit}
                    placeholder="Type the meaning of the idiom..."
                    disabled={isChecking}
                  />
                  {isChecking && (
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-2"></div>
                      <p className="text-gray-400 text-sm">
                        Checking your answer with AI...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-lg ${isCorrect
                      ? "bg-green-50 border-2 border-green-500"
                      : "bg-red-50 border-2 border-red-500"
                      }`}
                  >
                    <h3
                      className={`text-2xl font-bold mb-2 ${isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                    >
                      {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                    </h3>
                    {!isCorrect && (
                      <p className="text-gray-700 mb-2">
                        Your answer: "{userAnswer}"
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Correct Meaning:
                    </h3>
                    <p className="text-gray-700 text-lg">{idiomData.meaning}</p>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Try Again
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block text-center"
                    >
                      Back to Menu
                    </Link>
                  </div>
                </div>
              )}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                  Powered by <span className="text-cyan-400">Llama 3.3 70B</span> on <span className="text-purple-400">Groq</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

