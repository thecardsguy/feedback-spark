import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserPreferences {
  soundNotificationsEnabled: boolean;
  notificationVolume: number;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

const defaultPreferences: UserPreferences = {
  soundNotificationsEnabled: true,
  notificationVolume: 50,
};

const STORAGE_KEY = "feedback-widget-preferences";

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Failed to load preferences from localStorage:", e);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn("Failed to save preferences to localStorage:", e);
    }
  }, [preferences]);

  const setSoundEnabled = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, soundNotificationsEnabled: enabled }));
  };

  const setVolume = (volume: number) => {
    setPreferences((prev) => ({ ...prev, notificationVolume: Math.max(0, Math.min(100, volume)) }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, setSoundEnabled, setVolume }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a UserPreferencesProvider");
  }
  return context;
}
