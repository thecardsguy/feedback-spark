import { useState, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceSearchButtonProps {
  onResult: (text: string) => void;
}

export function VoiceSearchButton({ onResult }: VoiceSearchButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceSearch = useCallback(async () => {
    // Check for browser support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice search is not supported in your browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      setIsProcessing(false);
      onResult(transcript);
      toast.success(`Searching: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setIsProcessing(false);

      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please enable it in your browser settings.");
      } else if (event.error === "no-speech") {
        toast.error("No speech detected. Please try again.");
      } else {
        toast.error("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
      toast.info("Listening... Speak your search query");
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsRecording(false);
      toast.error("Failed to start voice search");
    }
  }, [onResult]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleVoiceSearch}
      disabled={isProcessing}
      className={`h-7 w-7 transition-colors ${
        isRecording
          ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse"
          : "hover:bg-muted"
      }`}
      title={isRecording ? "Listening..." : "Voice search"}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
}
