
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
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Attack Vector (AV)</h3>
        <RadioGroup 
          value={metrics.attackVector} 
          onValueChange={(v) => handleChange('attackVector', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="av-n" />
            <Label htmlFor="av-n">Network (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="A" id="av-a" />
            <Label htmlFor="av-a">Adjacent (A)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="av-l" />
            <Label htmlFor="av-l">Local (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P" id="av-p" />
            <Label htmlFor="av-p">Physical (P)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-2">Attack Complexity (AC)</h3>
        <RadioGroup 
          value={metrics.attackComplexity} 
          onValueChange={(v) => handleChange('attackComplexity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="ac-l" />
            <Label htmlFor="ac-l">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="ac-h" />
            <Label htmlFor="ac-h">High (H)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-2">Privileges Required (PR)</h3>
        <RadioGroup 
          value={metrics.privilegesRequired} 
          onValueChange={(v) => handleChange('privilegesRequired', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="pr-n" />
            <Label htmlFor="pr-n">None (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="pr-l" />
            <Label htmlFor="pr-l">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="pr-h" />
            <Label htmlFor="pr-h">High (H)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">User Interaction (UI)</h3>
        <RadioGroup 
          value={metrics.userInteraction} 
          onValueChange={(v) => handleChange('userInteraction', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="ui-n" />
            <Label htmlFor="ui-n">None (N)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="R" id="ui-r" />
            <Label htmlFor="ui-r">Required (R)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Scope (S)</h3>
        <RadioGroup 
          value={metrics.scope} 
          onValueChange={(v) => handleChange('scope', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="U" id="s-u" />
            <Label htmlFor="s-u">Unchanged (U)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="s-c" />
            <Label htmlFor="s-c">Changed (C)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Confidentiality Impact (C)</h3>
        <RadioGroup 
          value={metrics.confidentiality} 
          onValueChange={(v) => handleChange('confidentiality', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="c-h" />
            <Label htmlFor="c-h">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="c-l" />
            <Label htmlFor="c-l">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="c-n" />
            <Label htmlFor="c-n">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Integrity Impact (I)</h3>
        <RadioGroup 
          value={metrics.integrity} 
          onValueChange={(v) => handleChange('integrity', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="i-h" />
            <Label htmlFor="i-h">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="i-l" />
            <Label htmlFor="i-l">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="i-n" />
            <Label htmlFor="i-n">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Availability Impact (A)</h3>
        <RadioGroup 
          value={metrics.availability} 
          onValueChange={(v) => handleChange('availability', v)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="H" id="a-h" />
            <Label htmlFor="a-h">High (H)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="a-l" />
            <Label htmlFor="a-l">Low (L)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="a-n" />
            <Label htmlFor="a-n">None (N)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
