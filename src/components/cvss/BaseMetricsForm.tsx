
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BaseMetricGroup } from "@/types/cvss";

interface BaseMetricsFormProps {
  metrics: BaseMetricGroup;
  onChange: (metrics: BaseMetricGroup) => void;
}

export const BaseMetricsForm: React.FC<BaseMetricsFormProps> = ({
  metrics,
  onChange
}) => {
  const handleChange = (metric: keyof BaseMetricGroup, value: any) => {
    onChange({
      ...metrics,
      [metric]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Attack Vector (AV)</h3>
        <RadioGroup 
          value={metrics.attackVector} 
          onValueChange={(v) => handleChange('attackVector', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="av-n" />
            <Label htmlFor="av-n" className="text-sm cursor-pointer">Network (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="A" id="av-a" />
            <Label htmlFor="av-a" className="text-sm cursor-pointer">Adjacent (A)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="av-l" />
            <Label htmlFor="av-l" className="text-sm cursor-pointer">Local (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P" id="av-p" />
            <Label htmlFor="av-p" className="text-sm cursor-pointer">Physical (P)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Attack Complexity (AC)</h3>
        <RadioGroup 
          value={metrics.attackComplexity} 
          onValueChange={(v) => handleChange('attackComplexity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="ac-l" />
            <Label htmlFor="ac-l" className="text-sm cursor-pointer">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="ac-h" />
            <Label htmlFor="ac-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Privileges Required (PR)</h3>
        <RadioGroup 
          value={metrics.privilegesRequired} 
          onValueChange={(v) => handleChange('privilegesRequired', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="pr-n" />
            <Label htmlFor="pr-n" className="text-sm cursor-pointer">None (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="pr-l" />
            <Label htmlFor="pr-l" className="text-sm cursor-pointer">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="pr-h" />
            <Label htmlFor="pr-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">User Interaction (UI)</h3>
        <RadioGroup 
          value={metrics.userInteraction} 
          onValueChange={(v) => handleChange('userInteraction', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="ui-n" />
            <Label htmlFor="ui-n" className="text-sm cursor-pointer">None (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="R" id="ui-r" />
            <Label htmlFor="ui-r" className="text-sm cursor-pointer">Required (R)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Scope (S)</h3>
        <RadioGroup 
          value={metrics.scope} 
          onValueChange={(v) => handleChange('scope', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="s-u" />
            <Label htmlFor="s-u" className="text-sm cursor-pointer">Unchanged (U)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="s-c" />
            <Label htmlFor="s-c" className="text-sm cursor-pointer">Changed (C)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Confidentiality Impact (C)</h3>
        <RadioGroup 
          value={metrics.confidentiality} 
          onValueChange={(v) => handleChange('confidentiality', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="c-h" />
            <Label htmlFor="c-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="c-l" />
            <Label htmlFor="c-l" className="text-sm cursor-pointer">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="c-n" />
            <Label htmlFor="c-n" className="text-sm cursor-pointer">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Integrity Impact (I)</h3>
        <RadioGroup 
          value={metrics.integrity} 
          onValueChange={(v) => handleChange('integrity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="i-h" />
            <Label htmlFor="i-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="i-l" />
            <Label htmlFor="i-l" className="text-sm cursor-pointer">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="i-n" />
            <Label htmlFor="i-n" className="text-sm cursor-pointer">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
        <h3 className="font-medium text-sm mb-2 pb-1 border-b">Availability Impact (A)</h3>
        <RadioGroup 
          value={metrics.availability} 
          onValueChange={(v) => handleChange('availability', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="a-h" />
            <Label htmlFor="a-h" className="text-sm cursor-pointer">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="a-l" />
            <Label htmlFor="a-l" className="text-sm cursor-pointer">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="a-n" />
            <Label htmlFor="a-n" className="text-sm cursor-pointer">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
