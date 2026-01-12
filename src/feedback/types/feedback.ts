/**
 * Feedback Widget Template - Type Definitions
 * 
 * These types are used across all tiers (Basic, Standard, Pro)
 */

// ============================================
// CORE DATA TYPES
// ============================================

export type FeedbackCategory = 'bug' | 'feature' | 'ui_ux' | 'suggestion' | 'other';
export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface TargetElement {
  selector: string;
  tagName: string;
  className: string;
  textPreview: string;
  boundingBox?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface FeedbackItem {
  id: string;
  user_id?: string;
  
  // Core fields
  raw_text: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  page_url?: string;
  
  // Element targeting
  target_element?: TargetElement;
  
  // AI enhancement (Pro tier)
  ai_summary?: string;
  ai_category?: FeedbackCategory;
  ai_question_for_dev?: string;
  
  // Metadata
  device_type?: DeviceType;
  context?: Record<string, unknown>;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type WidgetTier = 'basic' | 'standard' | 'pro';

export interface CustomCategory {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface FeedbackConfig {
  // === BRANDING ===
  appName: string;
  
  // === UI OPTIONS ===
  position: WidgetPosition;
  buttonColor?: string;
  buttonIcon?: 'message' | 'bug' | 'lightbulb' | 'help';
  
  // === FEATURE TOGGLES ===
  features: {
    elementPicker: boolean;
    categories: boolean;
    severityLevels: boolean;
    anonymousSubmission: boolean;
    screenshotCapture?: boolean;
  };
  
  // === AI OPTIONS (Pro tier) ===
  ai: {
    enabled: boolean;
    provider?: 'lovable' | 'openai';
    demoMode?: boolean; // Use mock AI responses for testing
    summarize: boolean;
    categorize: boolean;
    generateDevPrompt: boolean;
  };
  
  // === ADMIN OPTIONS ===
  admin: {
    showStats: boolean;
    copyToClipboard: boolean;
    exportEnabled: boolean;
    statusUpdates: boolean;
  };
  
  // === CUSTOM CATEGORIES ===
  categories?: CustomCategory[];
  
  // === CALLBACKS ===
  onSubmit?: (feedback: FeedbackSubmission) => void;
  onError?: (error: Error) => void;
  onSuccess?: (feedback: FeedbackItem) => void;
}

export interface FeedbackSubmission {
  raw_text: string;
  category?: FeedbackCategory;
  severity?: FeedbackSeverity;
  page_url?: string;
  target_element?: TargetElement;
  screenshot?: string; // Base64 encoded screenshot
  context?: Record<string, unknown>;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface FeedbackButtonProps {
  config: FeedbackConfig;
  className?: string;
}

export interface FeedbackFormProps {
  config: FeedbackConfig;
  onSubmit: (data: FeedbackSubmission) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ElementPickerProps {
  isActive: boolean;
  onSelect: (element: TargetElement) => void;
  onCancel: () => void;
}

export interface FeedbackDashboardProps {
  config: FeedbackConfig;
}

export interface FeedbackListProps {
  items: FeedbackItem[];
  onSelect: (item: FeedbackItem) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export interface FeedbackDetailProps {
  item: FeedbackItem;
  config: FeedbackConfig;
  onStatusChange?: (status: FeedbackStatus) => void;
  onClose: () => void;
}

export interface FeedbackStatsProps {
  items: FeedbackItem[];
}

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseFeedbackReturn {
  items: FeedbackItem[];
  isLoading: boolean;
  error: Error | null;
  submit: (data: FeedbackSubmission) => Promise<FeedbackItem>;
  updateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  refresh: () => void;
}

export interface UseFeedbackStatsReturn {
  totalCount: number;
  byCategory: Record<FeedbackCategory, number>;
  bySeverity: Record<FeedbackSeverity, number>;
  byStatus: Record<FeedbackStatus, number>;
  recentTrend: 'up' | 'down' | 'stable';
}
