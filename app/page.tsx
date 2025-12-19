import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rainbow-gradient opacity-20 blur-3xl"></div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16 animate-float">
          <h1 className="text-7xl md:text-8xl font-black mb-6 rainbow-text animate-pulse">
            Linguadash
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-3 font-semibold">
            English Micro-Learning Games
          </p>
          <p className="text-base text-gray-400">
            Choose a game to start learning! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/word"
            className="group relative glass-effect rounded-3xl p-8 hover:scale-110 transition-all duration-500 hover:shadow-2xl animate-pulse-glow"
          >
            <div className="absolute inset-0 rounded-3xl rainbow-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">📚</div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                Word of the Day
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Wordle-style guessing game with hints
              </p>
            </div>
          </Link>

          <Link
            href="/idiom"
            className="group relative glass-effect rounded-3xl p-8 hover:scale-110 transition-all duration-500 hover:shadow-2xl animate-pulse-glow"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute inset-0 rounded-3xl rainbow-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">💬</div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                Idiom of the Day
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Guess the meaning of English idioms
              </p>
            </div>
          </Link>

          <Link
            href="/grammar"
            className="group relative glass-effect rounded-3xl p-8 hover:scale-110 transition-all duration-500 hover:shadow-2xl animate-pulse-glow"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute inset-0 rounded-3xl rainbow-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">📝</div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-yellow-500 transition-all duration-300">
                Grammar Formula
              </h2>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Test your grammar knowledge
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
