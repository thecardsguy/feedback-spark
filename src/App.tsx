import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/common";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { FeedbackWidget } from "@/feedback";

const queryClient = new QueryClient();

// Hide FeedbackWidget on admin pages - admins have AI Chatbot instead
function RouteAwareFeedbackWidget() {
  const location = useLocation();
  
  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <FeedbackWidget 
      appName="Feedback Widget Template"
      position="bottom-right"
      enableAI={true}
    />
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <WidgetProvider initialTier="basic">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnimatedRoutes />
                <RouteAwareFeedbackWidget />
              </BrowserRouter>
            </TooltipProvider>
          </WidgetProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
