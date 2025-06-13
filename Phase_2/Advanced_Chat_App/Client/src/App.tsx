import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const context = useContext(AuthContext);

  // Optional: Add a fallback or error if context is missing
  if (!context) {
    return <div className="text-white p-4">Auth context not available</div>;
  }

  const { authUser } = context;

  return (
    <div className="bg-[url('./src/assets/bg.jpg')] bg-cover bg-center min-h-screen w-screen">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
