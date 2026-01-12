/**
 * Tier Comparison Table
 *
 * Visual comparison of Basic, Standard, and Pro tiers with checkmarks.
 * Includes export functionality for image and PDF downloads with settings modal.
 */

import { useRef, useState } from 'react';
import { Check, X, Sparkles, Download, Image, FileText, Settings2, Monitor, Printer, Presentation } from 'lucide-react';
import { getHtml2Canvas, getJsPDF } from '@/lib/vendorScripts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface ExportSettings {
  scale: number;
  pageSize: 'auto' | 'a4' | 'letter' | 'a3';
  includeBackground: boolean;
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

const PAGE_SIZES = {
  auto: { label: 'Auto (fit content)', width: null, height: null },
  a4: { label: 'A4 (210 × 297mm)', width: 595, height: 842 },
  letter: { label: 'Letter (8.5 × 11in)', width: 612, height: 792 },
  a3: { label: 'A3 (297 × 420mm)', width: 842, height: 1191 },
};

type PresetKey = 'web' | 'print' | 'presentation' | 'custom';

const EXPORT_PRESETS: Record<PresetKey, { label: string; icon: typeof Monitor; description: string; settings: ExportSettings }> = {
  web: {
    label: 'Web',
    icon: Monitor,
    description: 'Optimized for screens and sharing online',
    settings: { scale: 2, pageSize: 'auto', includeBackground: true },
  },
  print: {
    label: 'Print',
    icon: Printer,
    description: 'High quality for physical printing',
    settings: { scale: 3, pageSize: 'a4', includeBackground: true },
  },
  presentation: {
    label: 'Presentation',
    icon: Presentation,
    description: 'Large format for slides and projectors',
    settings: { scale: 4, pageSize: 'a3', includeBackground: true },
  },
  custom: {
    label: 'Custom',
    icon: Settings2,
    description: 'Configure your own settings',
    settings: { scale: 2, pageSize: 'auto', includeBackground: true },
  },
};

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

const TierComparison = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>('web');
  const [exportSettings, setExportSettings] = useState<ExportSettings>(
    EXPORT_PRESETS.web.settings
  );

  const applyPreset = (presetKey: PresetKey) => {
    setActivePreset(presetKey);
    if (presetKey !== 'custom') {
      setExportSettings(EXPORT_PRESETS[presetKey].settings);
    }
  };

  const handleSettingChange = (newSettings: Partial<ExportSettings>) => {
    setExportSettings((prev) => ({ ...prev, ...newSettings }));
    setActivePreset('custom');
  };

  const exportAsImage = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    try {
      const html2canvas = await getHtml2Canvas();
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: exportSettings.includeBackground ? '#ffffff' : null,
        scale: exportSettings.scale,
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
      const html2canvas = await getHtml2Canvas();
      const JsPDF = await getJsPDF();

      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: exportSettings.includeBackground ? '#ffffff' : null,
        scale: exportSettings.scale,
      });

      const imgData = canvas.toDataURL('image/png');
      const pageConfig = PAGE_SIZES[exportSettings.pageSize];
      
      const pdfOptions: any = {
        orientation: 'landscape',
        unit: 'px',
      };

      if (pageConfig.width && pageConfig.height) {
        pdfOptions.format = [pageConfig.height, pageConfig.width]; // landscape swap
      } else {
        pdfOptions.format = [canvas.width, canvas.height];
      }

      const pdf = new JsPDF(pdfOptions);
      
      if (pageConfig.width && pageConfig.height) {
        // Scale image to fit page
        const pdfWidth = pageConfig.height; // landscape
        const pdfHeight = pageConfig.width;
        const imgRatio = canvas.width / canvas.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        if (imgRatio > pdfRatio) {
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalWidth = pdfHeight * imgRatio;
        }
        
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      }
      
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
          <div className="flex items-center gap-2">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-border">
                <DialogHeader>
                  <DialogTitle>Export Settings</DialogTitle>
                  <DialogDescription>
                    Configure how the comparison table is exported.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Preset Selection */}
                  <div className="space-y-3">
                    <Label>Quick Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(EXPORT_PRESETS) as [PresetKey, typeof EXPORT_PRESETS.web][]).map(([key, preset]) => {
                        const Icon = preset.icon;
                        const isActive = activePreset === key;
                        return (
                          <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                              isActive
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <div className={`mt-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {preset.label}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {preset.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Manual Settings */}
                  <div className="space-y-2">
                    <Label htmlFor="scale">Resolution Scale</Label>
                    <Select
                      value={String(exportSettings.scale)}
                      onValueChange={(v) => handleSettingChange({ scale: Number(v) })}
                    >
                      <SelectTrigger id="scale" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="1">1x (Standard)</SelectItem>
                        <SelectItem value="2">2x (High quality)</SelectItem>
                        <SelectItem value="3">3x (Very high)</SelectItem>
                        <SelectItem value="4">4x (Maximum)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Higher scale = better quality, larger file size</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageSize">PDF Page Size</Label>
                    <Select
                      value={exportSettings.pageSize}
                      onValueChange={(v) => handleSettingChange({ pageSize: v as ExportSettings['pageSize'] })}
                    >
                      <SelectTrigger id="pageSize" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Object.entries(PAGE_SIZES).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Only applies to PDF exports</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="background">Include Background</Label>
                      <p className="text-xs text-muted-foreground">Add white background to export</p>
                    </div>
                    <Switch
                      id="background"
                      checked={exportSettings.includeBackground}
                      onCheckedChange={(checked) => handleSettingChange({ includeBackground: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
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
};

export default TierComparison;
