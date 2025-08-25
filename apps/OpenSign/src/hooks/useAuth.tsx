import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Parse from 'parse';
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
    // Check for existing session
    const checkCurrentUser = async () => {
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          setUser(currentUser);
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
      const user = await Parse.User.logIn(email, password);
      setUser(user);
      
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
      const user = new Parse.User();
      user.set('username', email);
      user.set('email', email);
      user.set('password', password);
      if (fullName) {
        user.set('fullName', fullName);
      }
      
      await user.signUp();
      setUser(user);
      
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      if (errorMessage.includes('already taken')) {
        toast({
          variant: "destructive",
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: errorMessage,
        });
      }
      return { error };
    }
  };

  const signInWithGoogle = async (googleToken: string) => {
    try {
      // Use Parse's linkWith method for Google authentication
      const user = await Parse.User.logInWith('google', { authData: { id: googleToken } });
      setUser(user);
      
      toast({
        title: "Welcome!",
        description: "You've been signed in with Google successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      // If user doesn't exist, try to create one
      try {
        const user = new Parse.User();
        user.set('authData', { google: { id: googleToken } });
        await user.signUp();
        setUser(user);
        
        toast({
          title: "Account Created!",
          description: "Your Google account has been linked successfully.",
        });
        
        return { error: null };
      } catch (signUpError: any) {
        const errorMessage = signUpError.message || 'Google authentication failed.';
        toast({
          variant: "destructive",
          title: "Google Sign In Failed",
          description: errorMessage,
        });
        return { error: signUpError };
      }
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