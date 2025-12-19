"use client";

import { useState } from "react";
import { useUser } from "./UserContext";

export default function LoginModal() {
    const { user, login } = useUser();
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await login(name);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-black mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Welcome!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                    Enter your name to start playing and save your score.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Name
                        </label>
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-gray-50 dark:bg-gray-800 transition-all"
                            placeholder="e.g. WordMaster"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Joining...
                            </span>
                        ) : (
                            "Start Playing 🚀"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
