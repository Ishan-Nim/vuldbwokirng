
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
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Exploit Code Maturity (E)</h3>
        <RadioGroup 
          value={metrics.exploitCodeMaturity} 
          onValueChange={(v) => handleChange('exploitCodeMaturity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="e-x" />
            <Label htmlFor="e-x">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="e-h" />
            <Label htmlFor="e-h">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="F" id="e-f" />
            <Label htmlFor="e-f">Functional (F)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P" id="e-p" />
            <Label htmlFor="e-p">Proof of Concept (P)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="e-u" />
            <Label htmlFor="e-u">Unproven (U)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-2">Remediation Level (RL)</h3>
        <RadioGroup 
          value={metrics.remediationLevel} 
          onValueChange={(v) => handleChange('remediationLevel', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="rl-x" />
            <Label htmlFor="rl-x">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="rl-u" />
            <Label htmlFor="rl-u">Unavailable (U)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="W" id="rl-w" />
            <Label htmlFor="rl-w">Workaround (W)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="T" id="rl-t" />
            <Label htmlFor="rl-t">Temporary Fix (T)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="O" id="rl-o" />
            <Label htmlFor="rl-o">Official Fix (O)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-2">Report Confidence (RC)</h3>
        <RadioGroup 
          value={metrics.reportConfidence} 
          onValueChange={(v) => handleChange('reportConfidence', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="X" id="rc-x" />
            <Label htmlFor="rc-x">Not Defined (X)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="rc-c" />
            <Label htmlFor="rc-c">Confirmed (C)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="R" id="rc-r" />
            <Label htmlFor="rc-r">Reasonable (R)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="rc-u" />
            <Label htmlFor="rc-u">Unknown (U)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
