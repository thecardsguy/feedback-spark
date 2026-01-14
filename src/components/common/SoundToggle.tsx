import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferences } from "@/contexts/UserPreferencesContext";
import { useNotificationSound } from "@/hooks/useNotificationSound";

export function SoundToggle() {
  const { preferences, setSoundEnabled } = usePreferences();
  const { playTestSound } = useNotificationSound();

  const handleToggle = () => {
    const newState = !preferences.soundNotificationsEnabled;
    setSoundEnabled(newState);
    
    // Play test sound when enabling
    if (newState) {
      setTimeout(() => playTestSound(), 100);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={handleToggle}
        >
          {preferences.soundNotificationsEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {preferences.soundNotificationsEnabled 
          ? "Sound notifications on" 
          : "Sound notifications off"}
      </TooltipContent>
    </Tooltip>
  );
}
