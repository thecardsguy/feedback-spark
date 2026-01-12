/**
 * Tier Comparison Table
 * 
 * Visual comparison of Basic, Standard, and Pro tiers with checkmarks.
 */

import { Check, X, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Feature {
  name: string;
  description: string;
  basic: boolean;
  standard: boolean;
  pro: boolean;
}

const FEATURES: Feature[] = [
  // User Features
  { name: 'Floating Button', description: 'Customizable feedback trigger', basic: true, standard: true, pro: true },
  { name: 'Category Selection', description: 'Bug, Feature, UI/UX, etc.', basic: true, standard: true, pro: true },
  { name: 'Element Picker', description: 'Click to target elements', basic: true, standard: true, pro: true },
  { name: 'Anonymous Submission', description: 'No login required', basic: true, standard: true, pro: true },
  { name: 'Severity Levels', description: 'Low, Medium, High, Critical', basic: false, standard: true, pro: true },
  // Admin Features
  { name: 'Admin Dashboard', description: 'View and manage feedback', basic: false, standard: true, pro: true },
  { name: 'Status Updates', description: 'Pending → Reviewed → Resolved', basic: false, standard: true, pro: true },
  { name: 'Statistics', description: 'Charts and trend analysis', basic: false, standard: true, pro: true },
  { name: 'Export Data', description: 'Download as CSV/JSON', basic: false, standard: true, pro: true },
  { name: 'Copy to Clipboard', description: 'Quick copy for AI prompts', basic: false, standard: true, pro: true },
  // AI Features
  { name: 'AI Summarization', description: 'Auto-summarize feedback', basic: false, standard: false, pro: true },
  { name: 'AI Categorization', description: 'Smart category detection', basic: false, standard: false, pro: true },
  { name: 'Developer Prompts', description: 'AI-generated fix prompts', basic: false, standard: false, pro: true },
];

const FeatureCheck = ({ enabled }: { enabled: boolean }) => (
  enabled ? (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-500" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
        <X className="w-4 h-4 text-muted-foreground/50" />
      </div>
    </div>
  )
);

export function TierComparison() {
  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Feature Comparison</h3>
            <p className="text-sm text-muted-foreground">See what's included in each tier</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead className="text-center w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span>Basic</span>
                  <Badge variant="outline" className="text-[10px] font-normal">Free</Badge>
                </div>
              </TableHead>
              <TableHead className="text-center w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-primary font-semibold">Standard</span>
                  <Badge className="text-[10px] font-normal bg-primary/10 text-primary border-primary/20">Popular</Badge>
                </div>
              </TableHead>
              <TableHead className="text-center w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span>Pro</span>
                  <Badge variant="secondary" className="text-[10px] font-normal">+ AI</Badge>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FEATURES.map((feature, index) => (
              <TableRow key={feature.name} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </TableCell>
                <TableCell><FeatureCheck enabled={feature.basic} /></TableCell>
                <TableCell className="bg-primary/5"><FeatureCheck enabled={feature.standard} /></TableCell>
                <TableCell><FeatureCheck enabled={feature.pro} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Included</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-muted-foreground/50" />
            <span>Not included</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TierComparison;
