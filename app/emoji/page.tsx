"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TextInput from "@/components/TextInput";
import emojiData from "@/data/emoji.json";
import { useUser } from "@/components/UserContext";
import confetti from "canvas-confetti";

export default function EmojiPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<{
    id: number;
    emojis: string[];
    answer: string;
    hint: string;
  } | null>(null);
  const { addPoints } = useUser();

  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getRandomPuzzle = () => {
    const puzzles = emojiData;
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  };

  useEffect(() => {
    setCurrentPuzzle(getRandomPuzzle());
  }, []);

  const handleSubmit = () => {
    if (!userAnswer.trim() || submitted || !currentPuzzle) return;

    const userLower = userAnswer.toLowerCase().trim();
    const correctLower = currentPuzzle.answer.toLowerCase().trim();

    if (userLower === correctLower) {
      setIsCorrect(true);
      addPoints(10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setIsCorrect(false);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setCurrentPuzzle(getRandomPuzzle());
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
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
            Emoji Word
          </h1>
          <p className="text-xl text-gray-300 font-semibold">
            Guess the word or phrase from the emojis!
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-yellow-500/30">
          {!currentPuzzle ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="flex justify-center gap-4 text-6xl md:text-8xl mb-6 animate-pulse">
                  {currentPuzzle.emojis.map((emoji, index) => (
                    <span key={index}>{emoji}</span>
                  ))}
                </div>
                <p className="text-gray-300 text-lg font-semibold">
                  What is the word?
                </p>
              </div>

              {!submitted ? (
                <div className="space-y-6">
                  <TextInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    onSubmit={handleSubmit}
                    placeholder="Type your guess..."
                  />

                  <div className="text-center">
                    <button
                      onClick={() => setShowHint(true)}
                      className={`text-sm ${showHint ? "text-yellow-400" : "text-gray-500 hover:text-gray-300"
                        } transition-colors underline`}
                    >
                      {showHint ? currentPuzzle.hint : "Need a hint?"}
                    </button>
                  </div>
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

                  <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Correct Answer:
                    </h3>
                    <p className="text-gray-700 text-lg font-bold">
                      {currentPuzzle.answer}
                    </p>
                    <p className="text-gray-600 mt-2 italic">
                      {currentPuzzle.hint}
                    </p>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Next Puzzle
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}
