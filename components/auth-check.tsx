"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isAuthenticated } from '@/lib/supabase-client';

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthCheck({ children, redirectTo = '/login' }: AuthCheckProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        setAuthenticated(isAuth);
        
        if (!isAuth && redirectTo) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthenticated(!!session);
        if (!session && redirectTo) {
          router.push(redirectTo);
        }
      }
    );

    checkAuth();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}