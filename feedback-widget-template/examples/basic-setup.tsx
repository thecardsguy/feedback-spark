/**
 * Basic Setup Example - User Feedback Widget (No AI)
 * 
 * This is the simplest implementation for collecting user feedback.
 * Perfect for: Landing pages, simple apps, MVPs
 * 
 * Features:
 * - Floating feedback button
 * - Simple text submission
 * - Element targeting (optional)
 * - No authentication required
 * - No AI processing
 */

import React from 'react';
import { FeedbackButton, createConfig } from '../src';

// Create a basic configuration
const feedbackConfig = createConfig({
  appName: "My Website",
  position: "bottom-right",
  
  // Basic features only
  features: {
    elementPicker: true,      // Allow users to highlight elements
    categories: true,         // Show category dropdown
    severityLevels: false,    // Hide severity (keep it simple)
    anonymousSubmission: true // No login required
  },
  
  // No AI for basic tier
  ai: {
    enabled: false,
    provider: 'lovable',
    summarize: false,
    categorize: false,
    generateDevPrompt: false
  },
  
  // Minimal admin features
  admin: {
    showStats: false,
    copyToClipboard: false,
    exportEnabled: false,
    statusUpdates: false
  },
  
  // Optional: Custom callback
  onSubmit: (feedback) => {
    console.log('Feedback submitted:', feedback);
    // Optional: Track with your analytics
    // analytics.track('feedback_submitted', { category: feedback.category });
  },
  
  onError: (error) => {
    console.error('Feedback error:', error);
  }
}, 'basic');  // Use 'basic' preset as base

/**
 * Basic App with Feedback Button
 */
export function BasicApp() {
  return (
    <div className="min-h-screen">
      {/* Your app content */}
      <header className="p-4 bg-blue-600 text-white">
        <h1>My Website</h1>
      </header>
      
      <main className="p-8">
        <h2>Welcome to My Website</h2>
        <p>This is where your content goes.</p>
      </main>
      
      {/* Add the feedback button - that's it! */}
      <FeedbackButton config={feedbackConfig} />
    </div>
  );
}

/**
 * Alternative: Inline Feedback Button
 * 
 * If you prefer the button inside your UI rather than floating:
 */
export function InlineFeedbackExample() {
  return (
    <div className="p-4">
      <h1>Help Center</h1>
      <p>Need help? We're here for you.</p>
      
      {/* Render button inline with position override */}
      <div className="mt-4">
        <FeedbackButton 
          config={{
            ...feedbackConfig,
            // These would need to be handled by a modified FeedbackButton
            // that supports inline rendering
          }} 
        />
      </div>
    </div>
  );
}

/**
 * Using with React Router
 */
export function AppWithRouter() {
  return (
    <div>
      {/* Your router setup */}
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes> */}
      
      {/* Feedback button is app-wide, outside router */}
      <FeedbackButton config={feedbackConfig} />
    </div>
  );
}

export default BasicApp;
