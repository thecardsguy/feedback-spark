/**
 * Pro Tier Example - Full AI-Powered Feedback Widget
 * 
 * This example demonstrates all AI-powered features:
 * - AI summarization
 * - Auto-categorization
 * - Developer question generation
 * - Smart filtering and analytics
 * 
 * Requirements:
 * - LOVABLE_API_KEY or OPENAI_API_KEY configured
 * - Pro tier configuration
 */

import React, { useState } from 'react';
import { 
  FeedbackButton, 
  FeedbackDashboard, 
  FeedbackStats,
  createConfig 
} from '../src';

// Create Pro tier configuration with all AI features
const proConfig = createConfig({
  appName: "Enterprise SaaS",
  position: "bottom-right",
  buttonColor: "#7c3aed",  // Purple for Pro
  
  features: {
    elementPicker: true,
    categories: true,
    severityLevels: true,
    anonymousSubmission: false  // Require auth for Pro
  },
  
  // Enable ALL AI features
  ai: {
    enabled: true,
    provider: 'lovable',      // Uses LOVABLE_API_KEY (auto-provided in Lovable Cloud)
    summarize: true,          // AI generates concise summary
    categorize: true,         // AI suggests best category
    generateDevPrompt: true   // AI creates developer questions
  },
  
  admin: {
    showStats: true,
    copyToClipboard: true,
    exportEnabled: true,
    statusUpdates: true
  },
  
  // Custom categories with icons
  categories: [
    { id: 'bug', label: 'Bug Report', icon: 'Bug', color: '#ef4444' },
    { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: '#3b82f6' },
    { id: 'performance', label: 'Performance', icon: 'Zap', color: '#f59e0b' },
    { id: 'security', label: 'Security', icon: 'Shield', color: '#8b5cf6' },
    { id: 'ux', label: 'User Experience', icon: 'Palette', color: '#ec4899' },
  ],
  
  // Track submissions
  onSubmit: (feedback) => {
    console.log('Pro feedback submitted:', feedback);
    
    // Example: Send to analytics
    // analytics.track('pro_feedback_submitted', {
    //   category: feedback.category,
    //   severity: feedback.severity,
    //   ai_enhanced: feedback.ai_summary !== null,
    //   has_target_element: feedback.target_element !== null,
    // });
  }
}, 'pro');

/**
 * Main App with Pro Feedback
 */
export function ProApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
      <header className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <h1 className="text-xl font-bold">Enterprise SaaS</h1>
      </header>
      
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to Pro</h2>
        <p className="text-gray-600 mb-8">
          Your AI-powered workspace. Try the feedback button to see AI enhancement in action!
        </p>
        
        {/* Demo content */}
        <div className="grid gap-4 md:grid-cols-3">
          <DemoCard title="Feature A" />
          <DemoCard title="Feature B" />
          <DemoCard title="Feature C" />
        </div>
      </main>
      
      {/* Pro feedback button with AI */}
      <FeedbackButton config={proConfig} />
    </div>
  );
}

function DemoCard({ title }: { title: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">
        Click the feedback button and target this card to see element picking in action.
      </p>
    </div>
  );
}

/**
 * Pro Admin Dashboard
 * 
 * Shows AI-enhanced insights and management tools.
 */
export function ProAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Feedback Admin (Pro)</h1>
          <div className="flex gap-2">
            <TabButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </TabButton>
            <TabButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </TabButton>
            <TabButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </TabButton>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {activeTab === 'dashboard' && (
          <FeedbackDashboard config={proConfig} />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}
        
        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>
    </div>
  );
}

function TabButton({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-white text-violet-600' 
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Analytics View - AI-Powered Insights
 */
function AnalyticsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI-Powered Analytics</h2>
      
      {/* Stats overview */}
      <FeedbackStats />
      
      {/* AI Insights Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          AI Insights
        </h3>
        
        <div className="space-y-4">
          <InsightCard 
            title="Top Issue Pattern"
            description="AI detected 15 similar reports about login timeout issues in the past week."
            action="View Related"
          />
          
          <InsightCard 
            title="Feature Request Trend"
            description="Dark mode is the most requested feature, mentioned in 23% of feedback."
            action="See Details"
          />
          
          <InsightCard 
            title="Suggested Priority"
            description="3 critical bugs reported today require immediate attention."
            action="Review Now"
          />
        </div>
      </div>
      
      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-4">Category Distribution (AI-Enhanced)</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          [Chart component would go here]
        </div>
      </div>
    </div>
  );
}

function InsightCard({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action: string;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-violet-50 rounded-lg">
      <div>
        <h4 className="font-medium text-violet-900">{title}</h4>
        <p className="text-sm text-violet-700">{description}</p>
      </div>
      <button className="px-3 py-1 bg-violet-600 text-white text-sm rounded hover:bg-violet-700">
        {action}
      </button>
    </div>
  );
}

/**
 * Settings View
 */
function SettingsView() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoCategories, setAutoCategories] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Pro Settings</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <SettingToggle
          label="AI Enhancement"
          description="Enable AI summarization and categorization for new feedback"
          checked={aiEnabled}
          onChange={setAiEnabled}
        />
        
        <SettingToggle
          label="Auto-Categorization"
          description="Let AI automatically assign categories to feedback"
          checked={autoCategories}
          onChange={setAutoCategories}
        />
        
        <SettingToggle
          label="Email Notifications"
          description="Receive email for critical feedback"
          checked={notifications}
          onChange={setNotifications}
        />
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">AI Provider</h4>
          <select className="w-full p-2 border rounded">
            <option value="lovable">Lovable AI (Default)</option>
            <option value="openai">OpenAI</option>
            <option value="custom">Custom Provider</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Lovable AI is included with your plan. Other providers require API keys.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-violet-600' : 'bg-gray-300'
        }`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );
}

/**
 * Using with Different AI Providers
 */
export function CustomAIProviderExample() {
  // Use OpenAI instead of Lovable AI
  const openaiConfig = createConfig({
    appName: "My App",
    ai: {
      enabled: true,
      provider: 'openai',  // Requires OPENAI_API_KEY secret
      summarize: true,
      categorize: true,
      generateDevPrompt: true
    }
  }, 'pro');

  return <FeedbackButton config={openaiConfig} />;
}

export default ProApp;
