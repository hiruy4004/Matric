import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Create a single instance of the Supabase client for use in client components
export const supabase = createClientComponentClient<Database>();

// Helper function to safely get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Session error:", error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper function to safely get the current user
export const getUser = async () => {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};