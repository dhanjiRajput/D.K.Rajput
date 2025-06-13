import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Set base URL
axios.defaults.baseURL = "http://localhost:5000";

// Define context value type

export interface AuthContextType {
  authUser: any; // Replace 'any' with the actual type of authUser if known
  axios: typeof axios;
  onlineUsers?: any[];
  socket?: any;
  login?: (
  state: "login" | "signup" ,
  credentials: { email: string; password: string; [key: string]: any }
) => Promise<void>;

  logout?: () => Promise<void>;
  updateProfile?: (body: { [key: string]: any }) => Promise<void>;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [authUser, setAuthUser] = useState<any>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [socket, setSocket] = useState<any>(null);

    //Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const {data}=await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while checking authentication.");
        }
    };

    //Login function to handle user authentication and socket connection
    interface LoginCredentials {
        email: string;
        password: string;
        [key: string]: any;
        // add other fields if needed
    }

    interface LoginResponse {
        success: boolean;
        token?: string;
        userData?: any; // Replace 'any' with your User type if available
        message?: string;
    }

    type AuthState = "login" | "signup"; // or other possible states

    const login = async (
        state: AuthState,
        credentials: LoginCredentials
    ): Promise<void> => {
        try {
            const { data }: { data: LoginResponse } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setToken(data.token!);
                localStorage.setItem("token", data.token!);
                axios.defaults.headers.common["token"] = data.token!;
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

    //Logout function to handle user logout and socket disconnection
    const logout = async () =>{
        localStorage.removeItem("token");
        setToken("");
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout successful");
        socket.disconnect();
    };

    //Update profile function to handle user profile updates
    interface UpdateProfileBody {
        // Define the fields that can be updated in the profile
        name?: string;
        email?: string;
        password?: string;
        // Add other fields as needed
        [key: string]: any;
    }

    interface UpdateProfileResponse {
        success: boolean;
        user?: any; // Replace 'any' with your User type if available
        message?: string;
    }

    const updateProfile = async (body: UpdateProfileBody): Promise<void> => {
        try {
            const { data }: { data: UpdateProfileResponse } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success(data.message || "Profile updated successfully");
            } else {
                toast.error(data.message || "Profile update failed");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    //connectsocket Function to handle socket connection and online users updates
    interface UserData {
        _id: string;
        // Add other user fields if needed
        [key: string]: any;
    }


    const backendUrl: string = "http://localhost:5000";

    const connectSocket = async (userData: UserData): Promise<void> => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds: any[]) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, []);

  const value: AuthContextType = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
