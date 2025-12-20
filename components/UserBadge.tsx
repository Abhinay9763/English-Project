"use client";

import { useUser } from "./UserContext";

export default function UserBadge() {
    const { user, logout, rank } = useUser();

    if (!user) return null;

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4 glass-effect px-4 py-2 rounded-full border border-white/10 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-gray-300 text-sm font-medium">
                        <span className="text-white font-bold">{user.name}</span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {rank && (
                        <div className="px-2.5 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 font-bold text-xs">
                            #{rank}
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-300">
                        <span className="text-lg">💰</span>
                        <span className="text-yellow-400 font-black text-sm tabular-nums">
                            {user.score} <span className="text-[10px] uppercase tracking-tighter opacity-70">pts</span>
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={logout}
                className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-tighter transition-colors border-l border-white/10 pl-4"
            >
                Change User
            </button>
        </div>
    );
}
