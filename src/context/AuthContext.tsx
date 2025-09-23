
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types/database.types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      // If supabase is not available, skip auth setup
      if (!supabase) {
        console.warn('Supabase client not available - skipping auth setup');
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (userData) setUser(userData as User);
      }
      
      setIsLoading(false);

      // Set up auth state change listener only if supabase is available
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          
          if (session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) setUser(userData as User);
          } else {
            setUser(null);
          }
          
          setIsLoading(false);
        }
        );

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    setup();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase is not connected. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase is not connected. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (data.user) {
        // Create a user record in our users table
        const { error: userError } = await supabase
          .from('users')
          .insert([{ 
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            total_points: 0,
            loyalty_level: 'Bronze'
          }]);
          
        if (userError) {
          console.error("Error creating user record:", userError);
        }
      }
      
      toast({
        title: "Account created!",
        description: "You've been successfully signed up.",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase is not connected. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase is not connected. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error resetting password",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
