import React, { createContext, useCallback, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { toast } from "../hooks/use-toast";

interface User {
  id?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        setIsLoading(false);
        if (isAuth) {
          setUser({
            id: "authenticated",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.signIn(email, password);
      setUser({
        id: "authenticated",
        email,
      });
      toast({
        title: "Success",
        description: "You have been signed in successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast({
        title: "Error",
        description: "Something went wrong during sign-in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.signUp(username, email, password);
      setUser({
        id: "authenticated",
        username,
        email,
      });
      toast({
        title: "Success",
        description: "You have been signed up successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast({
        title: "Error",
        description: "Something went wrong during sign-up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    authService.signOut();
    setUser(null);
    toast({
      title: "Success",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};