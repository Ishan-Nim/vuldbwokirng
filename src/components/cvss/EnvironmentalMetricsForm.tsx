
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EnvironmentalMetricGroup } from "@/types/cvss";

interface EnvironmentalMetricsFormProps {
  metrics: EnvironmentalMetricGroup;
  onChange: (metrics: EnvironmentalMetricGroup) => void;
}

export const EnvironmentalMetricsForm: React.FC<EnvironmentalMetricsFormProps> = ({
  metrics,
  onChange
}) => {
  const handleChange = (metric: keyof EnvironmentalMetricGroup, value: any) => {
    onChange({
      ...metrics,
      [metric]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Security Requirements Group */}
      <div className="pb-3 border-b border-border">
        <h3 className="text-lg font-medium mb-3">Security Requirements</h3>

        <div>
          <h4 className="font-medium mb-2">Confidentiality Requirement (CR)</h4>
          <RadioGroup 
            value={metrics.confidentialityRequirement} 
            onValueChange={(v) => handleChange('confidentialityRequirement', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="cr-x" />
              <Label htmlFor="cr-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="cr-h" />
              <Label htmlFor="cr-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="cr-m" />
              <Label htmlFor="cr-m">Medium (M)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="cr-l" />
              <Label htmlFor="cr-l">Low (L)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Integrity Requirement (IR)</h4>
          <RadioGroup 
            value={metrics.integrityRequirement} 
            onValueChange={(v) => handleChange('integrityRequirement', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="ir-x" />
              <Label htmlFor="ir-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="ir-h" />
              <Label htmlFor="ir-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="ir-m" />
              <Label htmlFor="ir-m">Medium (M)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="ir-l" />
              <Label htmlFor="ir-l">Low (L)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Availability Requirement (AR)</h4>
          <RadioGroup 
            value={metrics.availabilityRequirement} 
            onValueChange={(v) => handleChange('availabilityRequirement', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="ar-x" />
              <Label htmlFor="ar-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="ar-h" />
              <Label htmlFor="ar-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="ar-m" />
              <Label htmlFor="ar-m">Medium (M)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="ar-l" />
              <Label htmlFor="ar-l">Low (L)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Modified Base Metrics Group */}
      <div className="pt-2">
        <h3 className="text-lg font-medium mb-3">Modified Base Metrics</h3>

        <div>
          <h4 className="font-medium mb-2">Modified Attack Vector (MAV)</h4>
          <RadioGroup 
            value={metrics.modifiedAttackVector} 
            onValueChange={(v) => handleChange('modifiedAttackVector', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mav-x" />
              <Label htmlFor="mav-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="mav-n" />
              <Label htmlFor="mav-n">Network (N)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id="mav-a" />
              <Label htmlFor="mav-a">Adjacent (A)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="mav-l" />
              <Label htmlFor="mav-l">Local (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="P" id="mav-p" />
              <Label htmlFor="mav-p">Physical (P)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Attack Complexity (MAC)</h4>
          <RadioGroup 
            value={metrics.modifiedAttackComplexity} 
            onValueChange={(v) => handleChange('modifiedAttackComplexity', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mac-x" />
              <Label htmlFor="mac-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="mac-l" />
              <Label htmlFor="mac-l">Low (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="mac-h" />
              <Label htmlFor="mac-h">High (H)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Privileges Required (MPR)</h4>
          <RadioGroup 
            value={metrics.modifiedPrivilegesRequired} 
            onValueChange={(v) => handleChange('modifiedPrivilegesRequired', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mpr-x" />
              <Label htmlFor="mpr-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="mpr-n" />
              <Label htmlFor="mpr-n">None (N)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="mpr-l" />
              <Label htmlFor="mpr-l">Low (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="mpr-h" />
              <Label htmlFor="mpr-h">High (H)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified User Interaction (MUI)</h4>
          <RadioGroup 
            value={metrics.modifiedUserInteraction} 
            onValueChange={(v) => handleChange('modifiedUserInteraction', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mui-x" />
              <Label htmlFor="mui-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="mui-n" />
              <Label htmlFor="mui-n">None (N)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="R" id="mui-r" />
              <Label htmlFor="mui-r">Required (R)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Scope (MS)</h4>
          <RadioGroup 
            value={metrics.modifiedScope} 
            onValueChange={(v) => handleChange('modifiedScope', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="ms-x" />
              <Label htmlFor="ms-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="U" id="ms-u" />
              <Label htmlFor="ms-u">Unchanged (U)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="C" id="ms-c" />
              <Label htmlFor="ms-c">Changed (C)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Confidentiality Impact (MC)</h4>
          <RadioGroup 
            value={metrics.modifiedConfidentiality} 
            onValueChange={(v) => handleChange('modifiedConfidentiality', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mc-x" />
              <Label htmlFor="mc-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="mc-h" />
              <Label htmlFor="mc-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="mc-l" />
              <Label htmlFor="mc-l">Low (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="mc-n" />
              <Label htmlFor="mc-n">None (N)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Integrity Impact (MI)</h4>
          <RadioGroup 
            value={metrics.modifiedIntegrity} 
            onValueChange={(v) => handleChange('modifiedIntegrity', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="mi-x" />
              <Label htmlFor="mi-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="mi-h" />
              <Label htmlFor="mi-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="mi-l" />
              <Label htmlFor="mi-l">Low (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="mi-n" />
              <Label htmlFor="mi-n">None (N)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <h4 className="font-medium mb-2">Modified Availability Impact (MA)</h4>
          <RadioGroup 
            value={metrics.modifiedAvailability} 
            onValueChange={(v) => handleChange('modifiedAvailability', v)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="X" id="ma-x" />
              <Label htmlFor="ma-x">Not Defined (X)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="H" id="ma-h" />
              <Label htmlFor="ma-h">High (H)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="ma-l" />
              <Label htmlFor="ma-l">Low (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="ma-n" />
              <Label htmlFor="ma-n">None (N)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
