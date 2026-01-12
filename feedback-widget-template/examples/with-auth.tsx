/**
 * With Authentication Example - User Feedback Widget
 * 
 * This example shows how to use the feedback widget with authenticated users.
 * Feedback is linked to user accounts for follow-up.
 * 
 * Features:
 * - Authenticated submissions only
 * - User info attached to feedback
 * - Status updates visible to users
 * - Category and severity selection
 */

import React, { useEffect, useState } from 'react';
import { FeedbackButton, FeedbackDashboard, createConfig } from '../src';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Create configuration for authenticated users
const feedbackConfig = createConfig({
  appName: "My SaaS App",
  position: "bottom-right",
  
  features: {
    elementPicker: true,
    categories: true,
    severityLevels: true,
    anonymousSubmission: false  // Require authentication
  },
  
  ai: {
    enabled: false,  // Standard tier, no AI
    provider: 'lovable',
    summarize: false,
    categorize: false,
    generateDevPrompt: false
  },
  
  admin: {
    showStats: true,
    copyToClipboard: true,
    exportEnabled: true,
    statusUpdates: true
  }
}, 'standard');

/**
 * Main App with Authentication
 */
export function AuthenticatedApp() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen">
      <header className="p-4 bg-indigo-600 text-white flex justify-between">
        <h1>My SaaS App</h1>
        <div className="flex items-center gap-4">
          <span>{user.email}</span>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="px-3 py-1 bg-white/20 rounded"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="p-8">
        <h2>Welcome, {user.email}</h2>
        <p>Your dashboard content goes here.</p>
      </main>
      
      {/* Feedback button - only shown to authenticated users */}
      <FeedbackButton config={feedbackConfig} />
    </div>
  );
}

/**
 * Login Page Component
 */
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

/**
 * Admin Dashboard Page
 * 
 * Show this to admin users to manage feedback.
 */
export function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check auth and admin status
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        
        // Check if user is admin (implement your own logic)
        const { data } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    });
  }, []);

  if (!user || !isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-indigo-600 text-white">
        <h1>Feedback Dashboard</h1>
      </header>
      
      <main className="p-8">
        <FeedbackDashboard config={feedbackConfig} />
      </main>
    </div>
  );
}

/**
 * User's Own Feedback History
 * 
 * Let users see the status of their submitted feedback.
 */
export function MyFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const loadMyFeedback = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setFeedback(data || []);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Feedback</h1>
      
      {feedback.length === 0 ? (
        <p className="text-gray-500">You haven't submitted any feedback yet.</p>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {item.category}
                </span>
              </div>
              <p className="mt-2">{item.raw_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuthenticatedApp;
