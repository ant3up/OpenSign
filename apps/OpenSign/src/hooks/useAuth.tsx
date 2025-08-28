import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Parse from '@/lib/parse';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: Parse.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signInWithGoogle: (googleToken: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          setUser(currentUser as unknown as Parse.User);
        }
      } catch (error) {
        console.error('Error checking current user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const u = await Parse.User.logIn(email, password);
      setUser(u as unknown as Parse.User);
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage,
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const u = new Parse.User();
      u.set('username', email);
      u.set('email', email);
      u.set('password', password);
      if (fullName) u.set('fullName', fullName);

      await u.signUp();
      setUser(u as unknown as Parse.User);
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
      });
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
      return { error };
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      // Send Google id_token to Parse using the Google auth adapter; include sub as id when available
      // The Parse JS SDK's logInWith for custom providers expects a provider string and authData
      // We will decode the id_token minimally to extract the 'sub' without validating in the client.
      const [, payloadB64] = idToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      const sub = payload?.sub;

      const user = await (Parse.User as any).logInWith('google', {
        authData: {
          id: sub,
          id_token: idToken,
        },
      });

      setUser(user as unknown as Parse.User);
      toast({
        title: "Signed in with Google",
        description: "You're now signed in.",
      });
      return { error: null };
    } catch (error: any) {
      const errorMessage = error?.message || 'Google authentication failed.';
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: errorMessage,
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};