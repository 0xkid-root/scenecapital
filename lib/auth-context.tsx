"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { toast } from "@/components/ui/use-toast";

// Session types
interface Session {
  address: string;
  chainId: number;
  expirationTime: number;
  isAuthenticated: boolean;
}

// Auth context type
interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize session from localStorage on mount
  useEffect(() => {
    const initializeSession = () => {
      try {
        const storedSession = localStorage.getItem("auth-session");
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as Session;
          
          // Check if session is expired
          if (parsedSession.expirationTime > Date.now()) {
            setSession(parsedSession);
          } else {
            // Clear expired session
            localStorage.removeItem("auth-session");
            setSession(null);
          }
        }
      } catch (err) {
        console.error("Failed to initialize session:", err);
        localStorage.removeItem("auth-session");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Handle wallet disconnection
  useEffect(() => {
    if (!isConnected && session) {
      signOut();
    }
  }, [isConnected]);

  // Sign in with Ethereum
  const signIn = async () => {
    if (!address || !chainId) {
      setError(new Error("Wallet not connected"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = "Sign in with Ethereum to access Scene Capital";
      
      // Create expiration time (24 hours from now)
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      
      // Create SIWE message
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: "1",
        chainId,
        expirationTime: new Date(expirationTime).toISOString(),
      });
      
      // Create message to sign
      const messageToSign = message.prepareMessage();
      
      // Request signature from user
      const signature = await signMessageAsync({ message: messageToSign });
      
      // In a real implementation, you would verify the signature on your backend
      // For this example, we'll just create a session locally
      
      // Create session
      const newSession: Session = {
        address,
        chainId,
        expirationTime,
        isAuthenticated: true,
      };
      
      // Save session to localStorage
      localStorage.setItem("auth-session", JSON.stringify(newSession));
      
      // Update state
      setSession(newSession);
      
      toast({
        title: "Authentication Successful",
        description: "You have successfully signed in with your wallet",
        variant: "default",
      });
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err : new Error("Failed to authenticate"));
      
      toast({
        title: "Authentication Failed",
        description: err instanceof Error ? err.message : "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem("auth-session");
    setSession(null);
    disconnect();
    
    toast({
      title: "Signed Out",
      description: "You have been signed out of your account",
      variant: "default",
    });
  };

  // Refresh session
  const refreshSession = async () => {
    if (session && address) {
      // In a real implementation, you would verify the session with your backend
      // For this example, we'll just extend the expiration time
      
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      const updatedSession = {
        ...session,
        expirationTime,
      };
      
      localStorage.setItem("auth-session", JSON.stringify(updatedSession));
      setSession(updatedSession);
    } else {
      setError(new Error("No active session to refresh"));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        error,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
