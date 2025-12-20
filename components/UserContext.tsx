"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    name: string;
    score: number;
}

interface UserContextType {
    user: User | null;
    login: (name: string) => Promise<void>;
    addPoints: (points: number) => Promise<void>;
    updateUserScore: (score: number) => void;
    logout: () => void;
    rank: number | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [rank, setRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from local storage on mount
    useEffect(() => {
        const savedName = localStorage.getItem("linguadash_user");
        if (savedName) {
            // Re-login to get fresh score
            login(savedName).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const fetchRank = async (name: string) => {
        try {
            const res = await fetch("/api/leaderboard");
            const data: User[] = await res.json();
            const userRank = data.findIndex(u => u.name.toLowerCase() === name.toLowerCase()) + 1;
            setRank(userRank > 0 ? userRank : null);
        } catch (error) {
            console.error("Failed to fetch rank:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRank(user.name);
            const interval = setInterval(() => fetchRank(user.name), 3000);
            return () => clearInterval(interval);
        } else {
            setRank(null);
        }
    }, [user?.name, user?.score]);

    const login = async (name: string) => {
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            setUser(data);
            localStorage.setItem("linguadash_user", data.name);
        } catch (error: any) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const addPoints = async (points: number) => {
        if (!user) return;
        try {
            const response = await fetch("/api/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: user.name, points }),
            });
            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to add points:", error);
        }
    };

    // Optimistic update helper
    const updateUserScore = (newScore: number) => {
        if (user) {
            setUser({ ...user, score: newScore });
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("linguadash_user");
    };

    return (
        <UserContext.Provider value={{ user, login, addPoints, updateUserScore, logout, rank, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
