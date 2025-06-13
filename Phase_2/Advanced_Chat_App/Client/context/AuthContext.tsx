import { createContext, ReactNode } from "react";
import axios from "axios";

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Define context value type
interface AuthContextType {
  // example: user: User | null;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value: AuthContextType = {};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
