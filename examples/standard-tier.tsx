/**
 * Standard Tier Example
 * 
 * Full features without AI:
 * - Screenshot capture
 * - Severity levels
 * - Admin dashboard
 * - Statistics tracking
 * - Status management
 */

import { FeedbackButton, FeedbackDashboard } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';

// Standard tier feedback widget
export function StandardFeedbackWidget() {
  const config = createConfig({
    appName: 'My Application',
    position: 'bottom-right',
    features: {
      severityLevels: true,
      screenshotCapture: true,
      elementPicker: true,
      categories: true,
      anonymousSubmission: true,
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}

// Complete app setup with admin dashboard
export function StandardAppSetup() {
  return (
    <div>
      {/* Your app content */}
      <main>
        <h1>My Application</h1>
        <p>Your app content here...</p>
      </main>

      {/* Feedback widget - visible to all users */}
      <StandardFeedbackWidget />
    </div>
  );
}

// Admin dashboard page (protected route)
export function AdminDashboardPage() {
  const dashboardConfig = createConfig({
    appName: 'My Application',
    admin: {
      showStats: true,
      statusUpdates: true,
      copyToClipboard: true,
      exportEnabled: true,
    },
  }, 'standard');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Feedback Dashboard</h1>
      <FeedbackDashboard config={dashboardConfig} />
    </div>
  );
}

// React Router setup example
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export function AppWithRoutes() {
  const isAdmin = true; // Replace with your auth check

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StandardAppSetup />} />
        <Route 
          path="/admin" 
          element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

// Custom severity labels
export function StandardWithCustomSeverity() {
  const config = createConfig({
    appName: 'My App',
    features: {
      severityLevels: true,
      // Severity options are: low, medium, high, critical
      // These map to different visual styles in the dashboard
      elementPicker: true,
      categories: true,
      anonymousSubmission: true,
      screenshotCapture: true,
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}

// With element picker for precise feedback targeting
export function StandardWithElementPicker() {
  const config = createConfig({
    appName: 'My App',
    features: {
      elementPicker: true,    // Allow users to click on specific elements
      screenshotCapture: true, // Capture screenshot with highlighted element
      severityLevels: true,
      categories: true,
      anonymousSubmission: true,
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}
