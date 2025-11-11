import { create } from 'zustand';
import { supabase, User } from './supabase';

interface AuthStore {
  user: User | null;
  session: any;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;

  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set: any, get: any) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  isAdmin: false,

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed');

      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        display_name: displayName,
        role: 'user',
      });

      if (userError) throw userError;

      await get().fetchUser();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign up failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ session: data.session });
      await get().fetchUser();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign in failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, isAdmin: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign out failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        set({ user: null, session: null, isAdmin: false });
        return;
      }

      set({ session: sessionData.session });

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User doesn't exist yet
          set({ user: null });
          return;
        }
        throw error;
      }

      set({ user: userData as User, isAdmin: userData.role === 'admin' });
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ user: null, isAdmin: false });
    }
  },

  clearError: () => set({ error: null }),
}));
