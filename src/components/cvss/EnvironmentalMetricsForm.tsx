
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
    <div>
      {/* Security Requirements Group */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 pb-2 border-b">Security Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Confidentiality Requirement (CR)</h4>
            <RadioGroup 
              value={metrics.confidentialityRequirement} 
              onValueChange={(v) => handleChange('confidentialityRequirement', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="cr-x" />
                <Label htmlFor="cr-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="cr-h" />
                <Label htmlFor="cr-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="cr-m" />
                <Label htmlFor="cr-m" className="text-sm cursor-pointer">Medium (M)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="cr-l" />
                <Label htmlFor="cr-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Integrity Requirement (IR)</h4>
            <RadioGroup 
              value={metrics.integrityRequirement} 
              onValueChange={(v) => handleChange('integrityRequirement', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="ir-x" />
                <Label htmlFor="ir-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="ir-h" />
                <Label htmlFor="ir-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="ir-m" />
                <Label htmlFor="ir-m" className="text-sm cursor-pointer">Medium (M)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="ir-l" />
                <Label htmlFor="ir-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Availability Requirement (AR)</h4>
            <RadioGroup 
              value={metrics.availabilityRequirement} 
              onValueChange={(v) => handleChange('availabilityRequirement', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="ar-x" />
                <Label htmlFor="ar-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="ar-h" />
                <Label htmlFor="ar-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="ar-m" />
                <Label htmlFor="ar-m" className="text-sm cursor-pointer">Medium (M)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="ar-l" />
                <Label htmlFor="ar-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Modified Base Metrics Group */}
      <div>
        <h3 className="text-sm font-semibold mb-3 pb-2 border-b">Modified Base Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Attack Vector (MAV)</h4>
            <RadioGroup 
              value={metrics.modifiedAttackVector} 
              onValueChange={(v) => handleChange('modifiedAttackVector', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mav-x" />
                <Label htmlFor="mav-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="mav-n" />
                <Label htmlFor="mav-n" className="text-sm cursor-pointer">Network (N)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id="mav-a" />
                <Label htmlFor="mav-a" className="text-sm cursor-pointer">Adjacent (A)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="mav-l" />
                <Label htmlFor="mav-l" className="text-sm cursor-pointer">Local (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P" id="mav-p" />
                <Label htmlFor="mav-p" className="text-sm cursor-pointer">Physical (P)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Attack Complexity (MAC)</h4>
            <RadioGroup 
              value={metrics.modifiedAttackComplexity} 
              onValueChange={(v) => handleChange('modifiedAttackComplexity', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mac-x" />
                <Label htmlFor="mac-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="mac-l" />
                <Label htmlFor="mac-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="mac-h" />
                <Label htmlFor="mac-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Privileges Required (MPR)</h4>
            <RadioGroup 
              value={metrics.modifiedPrivilegesRequired} 
              onValueChange={(v) => handleChange('modifiedPrivilegesRequired', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mpr-x" />
                <Label htmlFor="mpr-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="mpr-n" />
                <Label htmlFor="mpr-n" className="text-sm cursor-pointer">None (N)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="mpr-l" />
                <Label htmlFor="mpr-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="mpr-h" />
                <Label htmlFor="mpr-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified User Interaction (MUI)</h4>
            <RadioGroup 
              value={metrics.modifiedUserInteraction} 
              onValueChange={(v) => handleChange('modifiedUserInteraction', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mui-x" />
                <Label htmlFor="mui-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="mui-n" />
                <Label htmlFor="mui-n" className="text-sm cursor-pointer">None (N)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="R" id="mui-r" />
                <Label htmlFor="mui-r" className="text-sm cursor-pointer">Required (R)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Scope (MS)</h4>
            <RadioGroup 
              value={metrics.modifiedScope} 
              onValueChange={(v) => handleChange('modifiedScope', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="ms-x" />
                <Label htmlFor="ms-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="U" id="ms-u" />
                <Label htmlFor="ms-u" className="text-sm cursor-pointer">Unchanged (U)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="C" id="ms-c" />
                <Label htmlFor="ms-c" className="text-sm cursor-pointer">Changed (C)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Confidentiality Impact (MC)</h4>
            <RadioGroup 
              value={metrics.modifiedConfidentiality} 
              onValueChange={(v) => handleChange('modifiedConfidentiality', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mc-x" />
                <Label htmlFor="mc-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="mc-h" />
                <Label htmlFor="mc-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="mc-l" />
                <Label htmlFor="mc-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="mc-n" />
                <Label htmlFor="mc-n" className="text-sm cursor-pointer">None (N)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Integrity Impact (MI)</h4>
            <RadioGroup 
              value={metrics.modifiedIntegrity} 
              onValueChange={(v) => handleChange('modifiedIntegrity', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="mi-x" />
                <Label htmlFor="mi-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="mi-h" />
                <Label htmlFor="mi-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="mi-l" />
                <Label htmlFor="mi-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="mi-n" />
                <Label htmlFor="mi-n" className="text-sm cursor-pointer">None (N)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-3 rounded-md border">
            <h4 className="font-medium text-sm mb-2 pb-1 border-b">Modified Availability Impact (MA)</h4>
            <RadioGroup 
              value={metrics.modifiedAvailability} 
              onValueChange={(v) => handleChange('modifiedAvailability', v)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="ma-x" />
                <Label htmlFor="ma-x" className="text-sm cursor-pointer">Not Defined (X)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="H" id="ma-h" />
                <Label htmlFor="ma-h" className="text-sm cursor-pointer">High (H)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="ma-l" />
                <Label htmlFor="ma-l" className="text-sm cursor-pointer">Low (L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="ma-n" />
                <Label htmlFor="ma-n" className="text-sm cursor-pointer">None (N)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};
