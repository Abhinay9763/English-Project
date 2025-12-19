"use client";

import { useUser } from "./UserContext";

export default function UserBadge() {
    const { user, logout } = useUser();

    if (!user) return null;

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4 glass-effect px-4 py-2 rounded-full border border-white/10 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-300 text-sm font-medium">
                    Playing as <span className="text-white font-bold">{user.name}</span>
                </span>
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
