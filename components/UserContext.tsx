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
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
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

    const login = async (name: string) => {
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem("linguadash_user", userData.name);
        } catch (error) {
            console.error("Login failed:", error);
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
        <UserContext.Provider value={{ user, login, addPoints, updateUserScore, logout, loading }}>
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
