import {  Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import PrivatePages from "./pages/PrivatePages";

const App = () => {



  return (
    <div className="bg-[url('./bg.jpg')] bg-cover bg-center min-h-screen w-screen">
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="" element={<PrivatePages />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
