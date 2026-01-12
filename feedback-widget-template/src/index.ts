/**
 * Feedback Widget Template - Main Export
 */

// Types
export * from './types/feedback';

// Config
export * from './config/feedback.config';

// Hooks
export * from './hooks/useFeedback';

// User Components
export { FeedbackButton } from './components/user/FeedbackButton';
export { FeedbackForm } from './components/user/FeedbackForm';
export { ElementPicker } from './components/user/ElementPicker';

// Admin Components
export { FeedbackDashboard } from './components/admin/FeedbackDashboard';
export { FeedbackList } from './components/admin/FeedbackList';
export { FeedbackDetail } from './components/admin/FeedbackDetail';
export { FeedbackStats } from './components/admin/FeedbackStats';
