"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import WordleGrid from "@/components/WordleGrid";
import Keyboard from "@/components/Keyboard";
import HintBox from "@/components/HintBox";
import wordsData from "@/data/word.json";

type WordData = {
  word: string;
  meaning: string;
  pos: string;
  origin: string;
  example: string;
};

export default function WordPage() {
  // Randomly select a word on client-side only to avoid hydration errors
  const [wordData, setWordData] = useState<WordData | null>(null);

  const getRandomWord = () => {
    const words = wordsData as Array<WordData>;
    return words[Math.floor(Math.random() * words.length)];
  };

  useEffect(() => {
    setWordData(getRandomWord());
  }, []);

  const handleReset = () => {
    // Get a new random word
    setWordData(getRandomWord());
    // Reset all game state
    setCurrentGuess("");
    setGuesses([]);
    setGameState("playing");
    setVisibleHints(3);
    setUsedLetters(new Set());
    setCorrectLetters(new Set());
    setPresentLetters(new Set());
  };

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [visibleHints, setVisibleHints] = useState(3);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [presentLetters, setPresentLetters] = useState<Set<string>>(new Set());

  const targetWord = wordData?.word.toLowerCase() || "";
  const maxAttempts = 5;

  const hints = wordData ? [
    `Meaning: ${wordData.meaning}`,
    `Part of Speech: ${wordData.pos}`,
    `Origin: ${wordData.origin}`,
  ] : [];

  const updateLetterStates = useCallback((guess: string) => {
    setUsedLetters((prevUsed) => {
      const newUsed = new Set(prevUsed);
      const newCorrect = new Set(correctLetters);
      const newPresent = new Set(presentLetters);

      guess.split("").forEach((letter, index) => {
        newUsed.add(letter);
        if (targetWord[index] === letter) {
          newCorrect.add(letter);
        } else if (targetWord.includes(letter)) {
          newPresent.add(letter);
        }
      });

      setCorrectLetters(newCorrect);
      setPresentLetters(newPresent);
      return newUsed;
    });
  }, [targetWord, correctLetters, presentLetters]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== "playing") return;
    
    setCurrentGuess((prev) => {
      if (prev.length < targetWord.length) {
        return prev + key;
      }
      return prev;
    });
  }, [gameState, targetWord.length]);

  const handleBackspace = useCallback(() => {
    if (gameState !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameState]);

  const handleEnter = useCallback(() => {
    if (gameState !== "playing" || !targetWord) return;
    
    setCurrentGuess((current) => {
      if (current.length !== targetWord.length) {
        return current;
      }

      const newGuesses = [...guesses, current];
      setGuesses(newGuesses);
      updateLetterStates(current);

      if (current.toLowerCase() === targetWord) {
        setGameState("won");
      } else {
        // Remove one hint for wrong guess
        setVisibleHints((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });

        // Check if lost
        if (newGuesses.length >= maxAttempts) {
          setGameState("lost");
        }
      }

      return "";
    });
  }, [gameState, targetWord, guesses, maxAttempts, updateLetterStates]);

  useEffect(() => {
    const handleKeyboardKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key.match(/^[a-z]$/i)) {
        handleKeyPress(e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleKeyboardKeyPress);
    return () => window.removeEventListener("keydown", handleKeyboardKeyPress);
  }, [gameState, handleEnter, handleBackspace, handleKeyPress]);

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rainbow-gradient opacity-10 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <span className="group-hover:translate-x-[-4px] inline-block transition-transform">←</span> Back to Menu
          </Link>
          <h1 className="text-5xl md:text-6xl font-black mb-4 rainbow-text">
            Word of the Day
          </h1>
          <p className="text-xl text-gray-300 font-semibold">
            Attempts: <span className="text-purple-400">{guesses.length}</span> / <span className="text-purple-400">{maxAttempts}</span>
          </p>
        </div>

        {!wordData ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : gameState === "playing" ? (
          <div className="space-y-6">
            <HintBox hints={hints} visibleHints={visibleHints} />
            
            <div className="glass-effect rounded-2xl p-6 shadow-2xl border border-purple-500/30">
              <WordleGrid
                guesses={guesses}
                targetWord={targetWord}
                currentGuess={currentGuess}
                maxAttempts={maxAttempts}
              />
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-2xl border border-blue-500/30">
              <Keyboard
                onKeyPress={handleKeyPress}
                onEnter={handleEnter}
                onBackspace={handleBackspace}
                usedLetters={usedLetters}
                correctLetters={correctLetters}
                presentLetters={presentLetters}
              />
            </div>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-pink-500/30 animate-pulse-glow">
            <div className="text-center mb-6">
              <h2 className={`text-4xl font-black mb-2 ${
                gameState === "won" 
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400" 
                  : "text-white"
              }`}>
                {gameState === "won" ? "🎉 Congratulations!" : "😔 Game Over"}
              </h2>
              <p className={`text-lg font-semibold ${
                gameState === "won" ? "text-gray-300" : "text-gray-400"
              }`}>
                {gameState === "won"
                  ? "You guessed the word correctly!"
                  : `The word was: ${targetWord.toUpperCase()}`}
              </p>
            </div>

            <div className="space-y-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
              <div>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">Word:</h3>
                <p className="text-3xl font-black rainbow-text">{wordData?.word.toUpperCase()}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Meaning:</h3>
                <p className="text-gray-200">{wordData?.meaning}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">Part of Speech:</h3>
                <p className="text-gray-200">{wordData?.pos}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">Origin:</h3>
                <p className="text-gray-200">{wordData?.origin}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 mb-2">Example:</h3>
                <p className="text-gray-200 italic">"{wordData?.example}"</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
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
      </div>
    </main>
  );
}

