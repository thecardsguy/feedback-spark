/**
 * Widget Context - Centralized State Management
 * 
 * Synchronizes widget configuration, tier selection, and feature states
 * across all components in the application.
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { FeedbackConfig, WidgetTier } from '@/feedback/types/feedback';
import { getPreset, createConfig, validateConfig } from '@/feedback/config/feedback.config';

interface WidgetState {
  tier: WidgetTier;
  config: FeedbackConfig;
  isInitialized: boolean;
  errors: string[];
}

interface WidgetContextType {
  state: WidgetState;
  setTier: (tier: WidgetTier) => void;
  updateConfig: (updates: Partial<FeedbackConfig>) => void;
  resetConfig: () => void;
  isFeatureEnabled: (feature: keyof FeedbackConfig['features']) => boolean;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ 
  children, 
  initialTier = 'basic' 
}: { 
  children: ReactNode;
  initialTier?: WidgetTier;
}) {
  const [state, setState] = useState<WidgetState>(() => {
    const config = getPreset(initialTier);
    return {
      tier: initialTier,
      config,
      isInitialized: true,
      errors: validateConfig(config),
    };
  });

  const setTier = useCallback((tier: WidgetTier) => {
    setState(prev => ({
      ...prev,
      tier,
      config: getPreset(tier),
      errors: [],
    }));
  }, []);

  const updateConfig = useCallback((updates: Partial<FeedbackConfig>) => {
    setState(prev => {
      const newConfig = createConfig(updates, prev.tier);
      return {
        ...prev,
        config: newConfig,
        errors: validateConfig(newConfig),
      };
    });
  }, []);

  const resetConfig = useCallback(() => {
    setState(prev => ({
      ...prev,
      config: getPreset(prev.tier),
      errors: [],
    }));
  }, []);

  const isFeatureEnabled = useCallback((feature: keyof FeedbackConfig['features']) => {
    return state.config.features?.[feature] ?? false;
  }, [state.config.features]);

  const value = useMemo(() => ({
    state,
    setTier,
    updateConfig,
    resetConfig,
    isFeatureEnabled,
  }), [state, setTier, updateConfig, resetConfig, isFeatureEnabled]);

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidget() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
}

export function useWidgetTier() {
  const { state, setTier } = useWidget();
  return { tier: state.tier, setTier };
}

export function useWidgetConfig() {
  const { state, updateConfig, resetConfig } = useWidget();
  return { config: state.config, updateConfig, resetConfig, errors: state.errors };
}
