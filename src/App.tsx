import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/common";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { FeedbackWidget } from "@/feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <WidgetProvider initialTier="basic">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
            {/* Global feedback widget for template improvement */}
            <FeedbackWidget 
              appName="Feedback Widget Template"
              position="bottom-right"
              enableAI={true}
            />
          </TooltipProvider>
        </WidgetProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
