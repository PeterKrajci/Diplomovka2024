import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Loader from "../components/Page/elements/Loader";

// Define a type for the user information
type User = {
  username: string;
  // Extend this type based on the user data you expect
};

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Initialize the context with undefined or an initial state as appropriate
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const signIn = async (username: string, password: string): Promise<void> => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!response.ok) throw new Error("Login failed");
      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch(`${backendUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const response = await fetch(`${backendUrl}/users/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set user data if session is valid
        } else {
          throw new Error("Session verification failed");
        }
      } catch (error) {
        console.error("Error verifying user session:", error);
      } finally {
        setIsLoading(false); // Ensure loading is set to false after the attempt
      }
    };

    verifyUserSession();
  }, [backendUrl]);

  if (!AuthContext)
    throw new Error("useAuth must be used within an AuthProvider");

  if (isLoading) {
    return <Loader />; // Or any other loading indicator
  }
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
