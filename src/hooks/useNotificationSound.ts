import { useCallback, useRef } from "react";
import { usePreferences } from "@/contexts/UserPreferencesContext";

// Create notification sound using Web Audio API
function createNotificationSound(volume: number = 0.5): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for bell-like sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bell-like frequency
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
    oscillator.type = "sine";
    
    // Volume envelope
    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    gainNode.gain.setValueAtTime(normalizedVolume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Cleanup
    setTimeout(() => {
      audioContext.close();
    }, 600);
  } catch (e) {
    console.warn("Failed to play notification sound:", e);
  }
}

export function useNotificationSound() {
  const { preferences } = usePreferences();
  const lastPlayedRef = useRef<number>(0);
  
  const playSound = useCallback(() => {
    if (!preferences.soundNotificationsEnabled) {
      return;
    }
    
    // Debounce - don't play more than once per second
    const now = Date.now();
    if (now - lastPlayedRef.current < 1000) {
      return;
    }
    lastPlayedRef.current = now;
    
    createNotificationSound(preferences.notificationVolume);
  }, [preferences.soundNotificationsEnabled, preferences.notificationVolume]);
  
  const playTestSound = useCallback(() => {
    createNotificationSound(preferences.notificationVolume);
  }, [preferences.notificationVolume]);
  
  return { playSound, playTestSound };
}
