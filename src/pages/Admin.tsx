import { FeedbackDashboard } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/AdminGuard';

const Admin = () => {
  return (
    <AdminGuard demoMode={false}>
      <div className="min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-border/50">
          <div className="container-custom py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Demo</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <MessageSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">Feedback Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground glass px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">Protected in Production</span>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="container-custom py-8">
          <FeedbackDashboard config={STANDARD_PRESET} />
        </main>
      </div>
    </AdminGuard>
  );
};

export default Admin;
