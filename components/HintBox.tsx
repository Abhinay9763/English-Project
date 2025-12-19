"use client";

interface HintBoxProps {
  hints: string[];
  visibleHints: number;
}

export default function HintBox({ hints, visibleHints }: HintBoxProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 shadow-2xl border border-cyan-500/30">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
        💡 Hints
      </h3>
      <div className="space-y-3">
        {hints.slice(0, visibleHints).map((hint, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border-l-4 border-purple-500 transform hover:scale-[1.02] transition-transform duration-200"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <p className="text-gray-200">{hint}</p>
          </div>
        ))}
        {visibleHints < hints.length && (
          <p className="text-sm text-gray-500 italic animate-pulse">
            🔒 {hints.length - visibleHints} hint{hints.length - visibleHints > 1 ? "s" : ""} hidden
          </p>
        )}
      </div>
    </div>
  );
}

