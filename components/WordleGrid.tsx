"use client";

interface WordleGridProps {
  guesses: string[];
  targetWord: string;
  currentGuess: string;
  maxAttempts: number;
}

type LetterState = "correct" | "present" | "absent";

export default function WordleGrid({
  guesses,
  targetWord,
  currentGuess,
  maxAttempts,
}: WordleGridProps) {
  const getLetterState = (letter: string, index: number, guess: string): LetterState => {
    if (targetWord[index] === letter) {
      return "correct";
    }
    if (targetWord.includes(letter)) {
      return "present";
    }
    return "absent";
  };

  const rows = [];
  
  // Show submitted guesses with colors
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const paddedGuess = guess.padEnd(targetWord.length, " ");

    rows.push(
      <div key={i} className="flex gap-2 justify-center">
        {paddedGuess.split("").map((letter, idx) => {
          const state = getLetterState(letter, idx, guess);
          
          const bgColor =
            state === "correct"
              ? "bg-green-500"
              : state === "present"
              ? "bg-yellow-500"
              : "bg-gray-300";

          return (
            <div
              key={idx}
              className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 ${bgColor} text-white transition-all duration-300 transform hover:scale-110 ${
                state === "correct" ? "border-green-400 shadow-lg shadow-green-500/50" :
                state === "present" ? "border-yellow-400 shadow-lg shadow-yellow-500/50" :
                "border-gray-600"
              }`}
            >
              {letter.toUpperCase()}
            </div>
          );
        })}
      </div>
    );
  }

  // Show current guess being typed (no colors)
  if (guesses.length < maxAttempts && currentGuess) {
    const paddedGuess = currentGuess.padEnd(targetWord.length, " ");
    rows.push(
      <div key="current" className="flex gap-2 justify-center">
        {paddedGuess.split("").map((letter, idx) => (
          <div
            key={idx}
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 border-gray-600 bg-gray-900/50 text-gray-300 transition-all duration-200"
          >
            {letter.toUpperCase()}
          </div>
        ))}
      </div>
    );
  }

  // Fill remaining empty rows
  const remainingRows = maxAttempts - guesses.length - (currentGuess ? 1 : 0);
  for (let i = 0; i < remainingRows; i++) {
    const paddedGuess = "".padEnd(targetWord.length, " ");
    rows.push(
      <div key={`empty-${i}`} className="flex gap-2 justify-center">
        {paddedGuess.split("").map((letter, idx) => (
          <div
            key={idx}
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 border-gray-600 bg-gray-900/50 text-gray-300"
          >
            {letter.toUpperCase()}
          </div>
        ))}
      </div>
    );
  }

  return <div className="space-y-2">{rows}</div>;
}

