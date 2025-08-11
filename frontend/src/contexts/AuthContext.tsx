import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: SubscriptionInfo;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  checkSubscription: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!session) return;
    
    try {
      // For now, set default subscription info
      // You can later integrate with Stripe or your payment provider
      setSubscription({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check subscription when user signs in
        if (session && event === 'SIGNED_IN') {
          await checkSubscription();
          // Redirect to dashboard after successful sign in
          if (window.location.pathname === '/' || window.location.pathname === '/auth-test') {
            window.location.href = '/dashboard';
          }
        } else if (!session) {
          setSubscription({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session) {
        await checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || '',
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    try {
      // Send reset email using our custom edge function
      // This will generate a token, store it in the database, and send the email
      const { error: emailError } = await supabase.functions.invoke('send-reset-email', {
        body: { email },
      });
      
      if (emailError) {
        console.error('Error sending reset email:', emailError);
        return { error: emailError };
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    subscription,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkSubscription,
    loading,
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
