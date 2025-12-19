"use client";

import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import Image from "next/image";
import Footer from "@/components/Footer";
import Creators from "@/components/Creators";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rainbow-gradient opacity-20 blur-3xl"></div>


      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16 animate-float">
          <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <Image
              src="/logo.jpg"
              alt="SMEC Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-2 rainbow-text animate-pulse pb-4">
            Linguadash
          </h1>
          <h2 className="text-2xl md:text-3xl text-cyan-400 font-bold mb-4">
            St. Martin&apos;s Engineering College
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block border border-white/20">
            <p className="text-lg text-gray-200 font-semibold mb-1">
              Department of English
            </p>
            <p className="text-sm text-yellow-400 font-bold uppercase tracking-widest">
              ✨ Project Expo Edition ✨
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <Link
              href="/emoji"
              className="group relative glass-effect rounded-3xl p-8 hover:scale-110 transition-all duration-500 hover:shadow-2xl animate-pulse-glow"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="absolute inset-0 rounded-3xl rainbow-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">😎</div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-300">
                  Emoji Word
                </h2>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Guess the word from emojis
                </p>
              </div>
            </Link>
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
        <Creators />
        <Footer />
      </div>
    </main>
  );
}
