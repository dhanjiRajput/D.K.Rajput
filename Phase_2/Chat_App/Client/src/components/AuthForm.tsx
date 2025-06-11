import { useState } from "react";
import API from "../services/api";
import type { User } from "../interface";
import { socket } from "../services/socket";

interface AuthFormProps {
  onLoginSuccess: (user: User) => void;
}

const AuthForm = ({ onLoginSuccess }: AuthFormProps) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegistering ? "/auth/register" : "/auth/login";
            const payload = isRegistering
                ? { email, username, password }
                : { email, password };

            const response = await API.post(endpoint, payload);
            const data = response.data as { token: string; username: string };

            localStorage.setItem("token", data.token);
            onLoginSuccess({ username: data.username, id: socket.id });

        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-violet-500" />

                <div className="px-8 py-12">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isRegistering ? "Create your account" : "Welcome to TeamSpaces"}
                        </h1>
                        <p className="mt-2 text-slate-600">
                            {isRegistering ? "Register to join the chat" : "Login to continue"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistering && (
                            <>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="e.g. rajput"
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. you@example.com"
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required
                                className="input-field"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                            {isRegistering ? "Register" : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                            {isRegistering ? "Login" : "Register"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
