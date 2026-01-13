/**
 * Authentication Integration Example
 * 
 * Patterns for integrating feedback with user authentication:
 * - User identification
 * - Admin access control
 * - Protected routes
 * - Session-aware feedback
 */

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FeedbackButton, FeedbackDashboard } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';
import { supabase } from '@/integrations/supabase/client';

// Types
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! });
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
          await checkAdminStatus(session.user.id);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase.rpc('is_admin');
    setIsAdmin(!!data);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}

// Feedback Widget with User Context
function AuthenticatedFeedback() {
  const { user } = useAuth();

  const config = createConfig({
    appName: 'My App',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    features: {
      severityLevels: true,
      screenshotCapture: true,
      elementPicker: true,
      categories: true,
      anonymousSubmission: false,
    },
    onSubmit: (feedback) => {
      // User ID is automatically attached via Supabase RLS
      console.log('Feedback from user:', user?.email, feedback);
    },
  }, 'pro');

  return <FeedbackButton config={config} />;
}

// Admin Dashboard with Auth
function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const dashboardConfig = createConfig({
    appName: 'My App',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    admin: {
      showStats: true,
      statusUpdates: true,
      copyToClipboard: true,
      exportEnabled: true,
    },
  }, 'pro');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <FeedbackDashboard config={dashboardConfig} />
    </div>
  );
}

// Login Page
function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border p-2"
        />
        <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
          Sign In
        </button>
      </form>
    </div>
  );
}

// Main App
function MainPage() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My App</h1>
        <div className="flex items-center gap-4">
          {user && <span>Welcome, {user.email}</span>}
          {isAdmin && (
            <a href="/admin" className="text-blue-500 hover:underline">
              Admin
            </a>
          )}
          <button onClick={signOut} className="text-gray-500 hover:underline">
            Sign Out
          </button>
        </div>
      </header>
      <main>
        <p>Your app content here...</p>
      </main>
      <AuthenticatedFeedback />
    </div>
  );
}

// Complete App with Auth
export function AppWithAuth() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Export for use
export default AppWithAuth;
