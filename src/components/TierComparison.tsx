/**
 * Tier Comparison Table
 * 
 * Visual comparison of Basic, Standard, and Pro tiers with checkmarks.
 * Includes export functionality for image and PDF downloads.
 */

import { useRef, useState } from 'react';
import { Check, X, Sparkles, Download, Image, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const tableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'tier-comparison.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('tier-comparison.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Feature Comparison</h3>
              <p className="text-sm text-muted-foreground">See what's included in each tier</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportAsImage}>
                <Image className="w-4 h-4 mr-2" />
                Download as Image (PNG)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div ref={tableRef} className="overflow-x-auto bg-background">
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
