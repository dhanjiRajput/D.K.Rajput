import { useState } from "react";
import { socket } from "./services/socket";
import Chat from "./components/Chat";
import AuthForm from "./components/AuthForm";
import type { User } from "./interface";

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        socket.connect();
        socket.emit("join", user.username);
    };

    const handleLogout = () => {
        socket.disconnect();
        setCurrentUser(null);
        localStorage.removeItem("token");
    };

    return currentUser ? (
        <Chat currentUser={currentUser} onLogout={handleLogout} />
    ) : (
        <AuthForm onLoginSuccess={handleLogin} />
    );
}

export default App;
