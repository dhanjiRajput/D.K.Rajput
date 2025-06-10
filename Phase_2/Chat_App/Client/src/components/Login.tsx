import { useState } from "react";
import type { LoginProps } from "../interface";

const Login = ({ onLogin }: LoginProps) => {
    const [username, setUsername] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">

                {/* Top Accent Gradient */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-violet-500" />

                <div className="px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Welcome to TeamSpaces</h1>
                        <p className="mt-2 text-slate-600">Join the conversation</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login Form">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                                Choose a username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                                    required
                                    aria-required="true"
                                    aria-label="Username"
                                />
                                {username.trim() && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div
                                            className="w-2 h-2 rounded-full bg-emerald-500"
                                            aria-label="Username is valid"
                                            title="Valid username"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            Join Chat
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-center text-sm text-slate-500">
                            By joining, you agree to our{" "}
                            <a href="#" className="text-blue-500 hover:text-blue-600">
                                T&C
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-500 hover:text-blue-600">
                                Privacy Policy
                            </a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
