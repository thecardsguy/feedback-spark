import { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle2, Share, Plus, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Install Feedback Widget
          </h1>
          <p className="text-muted-foreground">
            Add this app to your home screen for quick access
          </p>
        </div>

        {/* Status Card */}
        {isInstalled ? (
          <Card className="p-6 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-foreground">Already Installed!</h3>
                <p className="text-sm text-muted-foreground">
                  Look for the app on your home screen
                </p>
              </div>
            </div>
          </Card>
        ) : deferredPrompt ? (
          <Card className="p-6">
            <Button onClick={handleInstall} size="lg" className="w-full gap-2">
              <Download className="w-5 h-5" />
              Install App
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Works offline • Fast loading • No app store needed
            </p>
          </Card>
        ) : isIOS ? (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Install on iPhone/iPad</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Tap the</span>
                  <Share className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                  <span>button</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Scroll and tap</span>
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Add to Home Screen</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Tap</span>
                  <span className="font-medium">Add</span>
                  <span>to confirm</span>
                </div>
              </div>
            </div>
          </Card>
        ) : isAndroid ? (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Install on Android</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Tap the</span>
                  <MoreVertical className="w-4 h-4" />
                  <span className="font-medium">menu</span>
                  <span>button</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Tap</span>
                  <span className="font-medium">Install app</span>
                  <span>or</span>
                  <span className="font-medium">Add to Home screen</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Tap</span>
                  <span className="font-medium">Install</span>
                  <span>to confirm</span>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-muted-foreground text-center">
              Open this page on your mobile device to install the app
            </p>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <Download className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Works Offline</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Home Screen</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Fast Launch</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;
