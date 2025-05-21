
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TemporalMetricGroup } from "@/types/cvss";

interface TemporalMetricsFormProps {
  metrics: TemporalMetricGroup;
  onChange: (metrics: TemporalMetricGroup) => void;
}

export const TemporalMetricsForm: React.FC<TemporalMetricsFormProps> = ({
  metrics,
  onChange
}) => {
  const handleChange = (metric: keyof TemporalMetricGroup, value: any) => {
    onChange({
      ...metrics,
      [metric]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Exploit Code Maturity (E)</h3>
        <RadioGroup 
          value={metrics.exploitCodeMaturity} 
          onValueChange={(v) => handleChange('exploitCodeMaturity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="e-x" />
            <Label htmlFor="e-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="e-h" />
            <Label htmlFor="e-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="F" id="e-f" />
            <Label htmlFor="e-f" className="text-sm cursor-pointer">Functional (F)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P" id="e-p" />
            <Label htmlFor="e-p" className="text-sm cursor-pointer">Proof of Concept (P)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="e-u" />
            <Label htmlFor="e-u" className="text-sm cursor-pointer">Unproven (U)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Remediation Level (RL)</h3>
        <RadioGroup 
          value={metrics.remediationLevel} 
          onValueChange={(v) => handleChange('remediationLevel', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="rl-x" />
            <Label htmlFor="rl-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="rl-u" />
            <Label htmlFor="rl-u" className="text-sm cursor-pointer">Unavailable (U)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="W" id="rl-w" />
            <Label htmlFor="rl-w" className="text-sm cursor-pointer">Workaround (W)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="T" id="rl-t" />
            <Label htmlFor="rl-t" className="text-sm cursor-pointer">Temporary Fix (T)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="O" id="rl-o" />
            <Label htmlFor="rl-o" className="text-sm cursor-pointer">Official Fix (O)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Report Confidence (RC)</h3>
        <RadioGroup 
          value={metrics.reportConfidence} 
          onValueChange={(v) => handleChange('reportConfidence', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="rc-x" />
            <Label htmlFor="rc-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="rc-c" />
            <Label htmlFor="rc-c" className="text-sm cursor-pointer">Confirmed (C)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="R" id="rc-r" />
            <Label htmlFor="rc-r" className="text-sm cursor-pointer">Reasonable (R)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="rc-u" />
            <Label htmlFor="rc-u" className="text-sm cursor-pointer">Unknown (U)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
