/**
 * Footer Component
 * Site footer with logo, navigation links, and attribution
 */

import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Feedback Widget</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin Dashboard
            </Link>
            <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Live Demo
            </Link>
            <Link to="/setup" className="text-muted-foreground hover:text-foreground transition-colors">
              Setup Guide
            </Link>
            <a 
              href="https://github.com/lovableai/feedback-chatbot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
