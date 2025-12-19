"use client";

import { useEffect, useState } from "react";
import { useUser } from "./UserContext";

interface LeaderboardEntry {
    name: string;
    score: number;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const { user } = useUser();

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch("/api/leaderboard");
            const data = await res.json();
            setEntries(data);
        } catch (error) {
            console.error("Failed to load leaderboard");
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        // Refresh every 10 seconds
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, [user?.score]); // Refresh when user's score changes too

    return (
        <div className="glass-effect rounded-3xl p-6 h-full border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏆</span> Top Players
            </h2>

            <div className="space-y-3">
                {entries.map((entry, index) => (
                    <div
                        key={entry.name}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${entry.name === user?.name
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0
                                        ? "bg-yellow-400 text-yellow-900"
                                        : index === 1
                                            ? "bg-gray-300 text-gray-900"
                                            : index === 2
                                                ? "bg-orange-400 text-orange-900"
                                                : "bg-white/10 text-gray-400"
                                    }`}
                            >
                                {index + 1}
                            </span>
                            <span
                                className={`font-medium ${entry.name === user?.name ? "text-blue-400" : "text-gray-200"
                                    }`}
                            >
                                {entry.name}
                                {entry.name === user?.name && " (You)"}
                            </span>
                        </div>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                            {entry.score} pts
                        </span>
                    </div>
                ))}

                {entries.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No scores yet!</p>
                )}
            </div>
        </div>
    );
}
