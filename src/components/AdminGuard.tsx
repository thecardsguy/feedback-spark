/**
 * Admin Guard Component
 * 
 * Protects admin routes. For this template:
 * - Demo mode: Shows content with a banner explaining security
 * - Production: Checks auth and admin status
 */

import React from 'react';
import { Shield, AlertTriangle, Lock, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
  /** Set to true to allow demo access without auth */
  demoMode?: boolean;
}

export function AdminGuard({ children, demoMode = true }: AdminGuardProps) {
  const { user, isLoading, isAdmin } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // In demo mode, show content with security notice
  if (demoMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Security Notice Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Demo Mode:</strong> This dashboard is publicly accessible. 
                <span className="hidden sm:inline"> In production, set <code className="px-1 py-0.5 bg-amber-500/20 rounded">demoMode=false</code> and add yourself to admin_users.</span>
              </p>
            </div>
            {!user && (
              <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Production mode - require auth
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in as an admin to access this dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link to="/login">
                <Shield className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Not an Admin</h1>
          <p className="text-muted-foreground mb-4">
            Your account exists but you're not in the admin_users table.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left mb-6">
            <p className="text-xs text-muted-foreground mb-2">Run this SQL to add yourself:</p>
            <pre className="text-xs overflow-x-auto">
{`INSERT INTO public.admin_users (user_id)
VALUES ('${user.id}');`}
            </pre>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin
  return <>{children}</>;
}

export default AdminGuard;
