/**
 * Admin authentication hook
 * 
 * This hook checks if the current user is an admin by querying the admin_users table.
 * SECURITY: Admin status is verified server-side through RLS policies.
 * 
 * For template users: Add your user_id to the admin_users table to enable admin access.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null;
  error: string | null;
}

// SECURITY: Timeout protection to prevent hanging
const ADMIN_CHECK_TIMEOUT = 10000; // 10 seconds

export function useAdmin(): UseAdminReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setIsAdmin(false);
            setUserId(null);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setUserId(session.user.id);
        }

        // SECURITY: Create a timeout promise to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Admin check timed out'));
          }, ADMIN_CHECK_TIMEOUT);
        });

        // SECURITY: Use the is_admin() database function for secure server-side check
        // This function runs with SECURITY DEFINER and checks the admin_users table
        // Race against timeout to prevent slow network attacks
        const adminCheckPromise = supabase.rpc('is_admin');
        
        const { data, error: adminError } = await Promise.race([
          adminCheckPromise,
          timeoutPromise
        ]) as Awaited<typeof adminCheckPromise>;

        clearTimeout(timeoutId);

        if (mounted) {
          if (adminError) {
            // SECURITY: On error, deny access - never allow by default
            console.error('Admin check failed:', adminError.message);
            setIsAdmin(false);
            setError('Unable to verify admin status');
          } else {
            setIsAdmin(data === true);
            setError(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          // SECURITY: On error or timeout, deny access - never allow by default
          console.error('Admin check error:', err);
          setIsAdmin(false);
          setError(err instanceof Error && err.message.includes('timed out') 
            ? 'Admin verification timed out' 
            : 'Unable to verify admin status');
          setIsLoading(false);
        }
      }
    }

    checkAdmin();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, error };
}

/**
 * For template users:
 * 
 * To add yourself as an admin, run this SQL in the Supabase SQL editor:
 * 
 * INSERT INTO public.admin_users (user_id)
 * VALUES ('YOUR_USER_ID_HERE');
 * 
 * You can find your user_id in the Authentication > Users section of Supabase.
 */
