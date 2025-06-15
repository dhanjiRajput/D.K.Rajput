import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import API from "../services/api";

export interface AuthContextType {
  authUser: any;
  axios: typeof API;
  onlineUsers?: any[];
  socket?: any;
  login?: (
    state: "login" | "signup",
    credentials: { email: string; password: string; [key: string]: any }
  ) => Promise<void>;
  logout?: () => Promise<void>;
  updateProfile?: (body: { [key: string]: any }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const checkAuth = async () => {
    try {
      const { data } = await API.get("/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error: any) {
      toast.error("Error checking auth");
    }
  };

  const login = async (
    state: "login" | "signup",
    credentials: { email: string; password: string; [key: string]: any }
  ): Promise<void> => {
    try {
      const { data } = await API.post(`/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message || "Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout"); // <- Make sure backend clears the cookie
    } catch {}
    setAuthUser(null);
    setOnlineUsers([]);
    if (socket) {
      socket.off();
      socket.disconnect();
      setSocket(null);
    }
    toast.success("Logout successful");
  };

  const updateProfile = async (body: { [key: string]: any }) => {
    try {
      const { data } = await API.put("/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message || "Profile updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData: { _id: string }) => {
    if (!userData || socket?.connected) return;
    const newSocket = io("http://localhost:5000", {
      query: { userId: userData._id },
      withCredentials: true, // <--- VERY IMPORTANT if cookies used
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds: any[]) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    checkAuth(); // run once on mount
  }, []);

  const value: AuthContextType = {
    axios: API,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
