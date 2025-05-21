
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BaseMetricsForm } from "@/components/cvss/BaseMetricsForm";
import { TemporalMetricsForm } from "@/components/cvss/TemporalMetricsForm";
import { EnvironmentalMetricsForm } from "@/components/cvss/EnvironmentalMetricsForm";
import { ScoreDisplay } from "@/components/cvss/ScoreDisplay";
import { 
  BaseMetricGroup, 
  CVSSScore, 
  CVSSState, 
  EnvironmentalMetricGroup, 
  TemporalMetricGroup 
} from "@/types/cvss";
import { 
  calculateCVSSScore, 
  parseVectorString 
} from "@/lib/cvss";
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Calculator } from 'lucide-react';

const defaultBaseMetrics: BaseMetricGroup = {
  attackVector: 'N',
  attackComplexity: 'L',
  privilegesRequired: 'N',
  userInteraction: 'N',
  scope: 'U',
  confidentiality: 'L',
  integrity: 'L',
  availability: 'L'
};

const defaultTemporalMetrics: TemporalMetricGroup = {
  exploitCodeMaturity: 'X',
  remediationLevel: 'X',
  reportConfidence: 'X'
};

const defaultEnvironmentalMetrics: EnvironmentalMetricGroup = {
  confidentialityRequirement: 'X',
  integrityRequirement: 'X',
  availabilityRequirement: 'X',
  modifiedAttackVector: 'X',
  modifiedAttackComplexity: 'X',
  modifiedPrivilegesRequired: 'X',
  modifiedUserInteraction: 'X',
  modifiedScope: 'X',
  modifiedConfidentiality: 'X',
  modifiedIntegrity: 'X',
  modifiedAvailability: 'X'
};

const CVSS: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("base");
  const [vectorInput, setVectorInput] = useState<string>("");
  const [cvssState, setCvssState] = useState<CVSSState>({
    base: defaultBaseMetrics,
    temporal: defaultTemporalMetrics,
    environmental: defaultEnvironmentalMetrics
  });
  const [score, setScore] = useState<CVSSScore | null>(null);

  const handleBaseChange = (metrics: BaseMetricGroup) => {
    setCvssState(prev => ({ ...prev, base: metrics }));
    calculateScores({ ...cvssState, base: metrics });
  };

  const handleTemporalChange = (metrics: TemporalMetricGroup) => {
    setCvssState(prev => ({ ...prev, temporal: metrics }));
    calculateScores({ ...cvssState, temporal: metrics });
  };

  const handleEnvironmentalChange = (metrics: EnvironmentalMetricGroup) => {
    setCvssState(prev => ({ ...prev, environmental: metrics }));
    calculateScores({ ...cvssState, environmental: metrics });
  };

  const calculateScores = (state: CVSSState) => {
    const calculatedScore = calculateCVSSScore(
      state.base,
      state.temporal,
      state.environmental
    );
    setScore(calculatedScore);
  };

  const handleVectorImport = () => {
    if (!vectorInput) {
      toast({
        title: "Missing Vector",
        description: "Please enter a CVSS vector string.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedMetrics = parseVectorString(vectorInput);
      
      const newState = {
        base: parsedMetrics.base || defaultBaseMetrics,
        temporal: parsedMetrics.temporal || defaultTemporalMetrics,
        environmental: parsedMetrics.environmental || defaultEnvironmentalMetrics
      };
      
      setCvssState(newState);
      calculateScores(newState);
      
      toast({
        title: "Vector Imported",
        description: "CVSS vector successfully parsed and applied.",
      });
    } catch (error) {
      toast({
        title: "Invalid Vector",
        description: "The provided vector string is invalid or malformed.",
        variant: "destructive"
      });
    }
  };

  const resetCalculator = () => {
    setCvssState({
      base: defaultBaseMetrics,
      temporal: defaultTemporalMetrics,
      environmental: defaultEnvironmentalMetrics
    });
    setVectorInput("");
    setScore(null);
    
    toast({
      title: "Calculator Reset",
      description: "All metrics have been reset to their default values.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8" />
          CVSS 3.1 Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate vulnerability scores based on the Common Vulnerability Scoring System (CVSS) version 3.1. 
          Select metrics to determine the severity of security vulnerabilities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="vector-input" className="text-sm font-medium mb-2 block">
                  Import from CVSS Vector String
                </label>
                <div className="flex gap-2">
                  <Input 
                    id="vector-input"
                    placeholder="CVSS:3.1/AV:N/AC:L/..."
                    value={vectorInput}
                    onChange={(e) => setVectorInput(e.target.value)}
                  />
                  <Button onClick={handleVectorImport} variant="secondary">Import</Button>
                </div>
              </div>
              <Button 
                onClick={resetCalculator}
                variant="outline"
                className="shrink-0 mt-auto"
              >
                Reset Calculator
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="base">Base Metrics</TabsTrigger>
                <TabsTrigger value="temporal">Temporal Metrics</TabsTrigger>
                <TabsTrigger value="environmental">Environmental Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="base">
                <BaseMetricsForm metrics={cvssState.base} onChange={handleBaseChange} />
              </TabsContent>
              
              <TabsContent value="temporal">
                <TemporalMetricsForm metrics={cvssState.temporal} onChange={handleTemporalChange} />
              </TabsContent>
              
              <TabsContent value="environmental">
                <EnvironmentalMetricsForm metrics={cvssState.environmental} onChange={handleEnvironmentalChange} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">CVSS Score Results</h2>
            
            {score ? (
              <ScoreDisplay score={score} />
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Select base metrics to calculate the CVSS score.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Base Score:</strong> Reflects the intrinsic qualities of a vulnerability.
              </p>
              <p className="mb-2">
                <strong>Temporal Score:</strong> Reflects the current state of exploit techniques or code availability.
              </p>
              <p>
                <strong>Environmental Score:</strong> Customizes the score to a specific user's environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSS;
