"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import grammarDataArray from "@/data/grammar.json";

type GrammarData = {
  formula: string;
  description: string;
  examples: string[];
  question: string;
  answer: string;
  options: string[];
};

export default function GrammarPage() {
  // Randomly select a grammar question on client-side only to avoid hydration errors
  const [grammarData, setGrammarData] = useState<GrammarData | null>(null);

  const getRandomGrammar = () => {
    const grammar = grammarDataArray as Array<GrammarData>;
    return grammar[Math.floor(Math.random() * grammar.length)];
  };

  useEffect(() => {
    setGrammarData(getRandomGrammar());
  }, []);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (submitted) return;
    setSelectedOption(option);
  };

  const handleFillInSubmit = () => {
    if (!userAnswer.trim() || submitted) return;
    
    const answerParts = grammarData.answer.toLowerCase().split(",").map(s => s.trim());
    const userParts = userAnswer.toLowerCase().split(",").map(s => s.trim());
    
    // Check if both parts match (flexible)
    const firstMatch = answerParts[0] === userParts[0] || 
                      userParts[0].includes(answerParts[0]) || 
                      answerParts[0].includes(userParts[0]);
    const secondMatch = answerParts[1] === userParts[1] || 
                       userParts[1].includes(answerParts[1]) || 
                       answerParts[1].includes(userParts[1]);
    
    const correct = firstMatch && secondMatch;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleOptionSubmit = () => {
    if (!selectedOption || submitted || !grammarData) return;
    
    const correct = selectedOption.toLowerCase() === grammarData.answer.toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    // Get a new random grammar question
    setGrammarData(getRandomGrammar());
    // Reset all game state
    setSelectedOption(null);
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
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
            Grammar Formula
          </h1>
          <p className="text-xl text-gray-300 font-semibold">
            Test your grammar knowledge
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-green-500/30">
          {!grammarData ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                  {grammarData.formula}
                </h2>
                <p className="text-gray-200 mb-6 text-lg">{grammarData.description}</p>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 mb-6 border border-cyan-500/30">
                  <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Examples:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-200">
                    {grammarData.examples.map((example, idx) => (
                      <li key={idx} className="transform hover:translate-x-2 transition-transform duration-200">{example}</li>
                    ))}
                  </ul>
                </div>
              </div>

          {!submitted ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {grammarData.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {grammarData.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedOption === option
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white hover:border-blue-300"
                      }`}
                    >
                      <span className="font-semibold text-gray-800">{option}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleOptionSubmit}
                    disabled={!selectedOption}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-xl border-2 ${
                  isCorrect
                    ? "bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500 shadow-lg shadow-green-500/50"
                    : "bg-gradient-to-r from-red-900/40 to-pink-900/40 border-red-500 shadow-lg shadow-red-500/50"
                }`}
              >
                <h3
                  className={`text-3xl font-black mb-2 ${
                    isCorrect ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400" : "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400"
                  }`}
                >
                  {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                </h3>
                {!isCorrect && (
                  <p className="text-gray-300">
                    Your answer: "{selectedOption}"
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border-l-4 border-cyan-500">
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                  Correct Answer:
                </h3>
                <p className="text-gray-200 text-lg mb-4">{grammarData.answer}</p>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                  Explanation:
                </h3>
                <p className="text-gray-200">{grammarData.description}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border-2 border-purple-400 shadow-lg shadow-purple-500/50 transform hover:scale-105 active:scale-95"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 border-2 border-blue-400 shadow-lg shadow-blue-500/50 transform hover:scale-105 active:scale-95 inline-block text-center"
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

