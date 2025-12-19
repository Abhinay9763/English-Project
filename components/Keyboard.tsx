"use client";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  usedLetters: Set<string>;
  correctLetters: Set<string>;
  presentLetters: Set<string>;
}

export default function Keyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  usedLetters,
  correctLetters,
  presentLetters,
}: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const getKeyColor = (letter: string): string => {
    if (correctLetters.has(letter)) {
      return "bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/50";
    }
    if (presentLetters.has(letter)) {
      return "bg-yellow-500 text-white border-yellow-400 shadow-lg shadow-yellow-500/50";
    }
    if (usedLetters.has(letter)) {
      return "bg-gray-700 text-gray-300 border-gray-600";
    }
    return "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700 hover:border-gray-600";
  };

  return (
    <div className="space-y-2">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key.toLowerCase())}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 border-2 transform hover:scale-110 active:scale-95 ${getKeyColor(
                key
              )}`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex gap-2 justify-center mt-2">
        <button
          onClick={onEnter}
          className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 border-2 border-blue-400 shadow-lg shadow-blue-500/50 transform hover:scale-105 active:scale-95"
        >
          ENTER
        </button>
        <button
          onClick={onBackspace}
          className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 border-2 border-red-400 shadow-lg shadow-red-500/50 transform hover:scale-105 active:scale-95"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

