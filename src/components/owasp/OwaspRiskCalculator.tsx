
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadarChart } from "./RadarChart";
import { calculateOwaspRisk } from "@/lib/owasp";
import { OwaspVector } from "@/types/owasp";

export const OwaspRiskCalculator: React.FC = () => {
  // Factor selections
  const [threatFactors, setThreatFactors] = useState({
    skillLevel: "3",
    motive: "4",
    opportunity: "7",
    size: "6",
  });
  
  const [vulnerabilityFactors, setVulnerabilityFactors] = useState({
    easeOfDiscovery: "7",
    easeOfExploit: "1", 
    awareness: "1",
    intrusionDetection: "1",
  });
  
  const [technicalImpact, setTechnicalImpact] = useState({
    lossOfConfidentiality: "9",
    lossOfIntegrity: "9",
    lossOfAvailability: "9",
    lossOfAccountability: "9",
  });
  
  const [businessImpact, setBusinessImpact] = useState({
    financialDamage: "9",
    reputationDamage: "9",
    nonCompliance: "7",
    privacyViolation: "9",
  });

  const [scores, setScores] = useState({
    likelihood: 0,
    impact: 0,
    overall: 0,
    severity: '',
    vector: '',
  });

  useEffect(() => {
    calculateScores();
  }, [threatFactors, vulnerabilityFactors, technicalImpact, businessImpact]);

  const calculateScores = () => {
    const result = calculateOwaspRisk({
      ...threatFactors,
      ...vulnerabilityFactors,
      ...technicalImpact,
      ...businessImpact,
    });
    setScores(result);
  };

  const handleFactorChange = (category: string, factor: string, value: string) => {
    switch (category) {
      case 'threat':
        setThreatFactors(prev => ({ ...prev, [factor]: value }));
        break;
      case 'vulnerability':
        setVulnerabilityFactors(prev => ({ ...prev, [factor]: value }));
        break;
      case 'technical':
        setTechnicalImpact(prev => ({ ...prev, [factor]: value }));
        break;
      case 'business':
        setBusinessImpact(prev => ({ ...prev, [factor]: value }));
        break;
    }
  };

  // Generate radar chart data
  const radarData = [
    { name: 'Skill Level', value: parseInt(threatFactors.skillLevel) },
    { name: 'Motive', value: parseInt(threatFactors.motive) },
    { name: 'Opportunity', value: parseInt(threatFactors.opportunity) },
    { name: 'Population Size', value: parseInt(threatFactors.size) },
    { name: 'Easy of Discovery', value: parseInt(vulnerabilityFactors.easeOfDiscovery) },
    { name: 'Ease of Exploit', value: parseInt(vulnerabilityFactors.easeOfExploit) },
    { name: 'Awareness', value: parseInt(vulnerabilityFactors.awareness) },
    { name: 'Intrusion Detection', value: parseInt(vulnerabilityFactors.intrusionDetection) },
    { name: 'Loss of confidentiality', value: parseInt(technicalImpact.lossOfConfidentiality) },
    { name: 'Loss of Integrity', value: parseInt(technicalImpact.lossOfIntegrity) },
    { name: 'Loss of Availability', value: parseInt(technicalImpact.lossOfAvailability) },
    { name: 'Loss of Accountability', value: parseInt(technicalImpact.lossOfAccountability) },
    { name: 'Financial damage', value: parseInt(businessImpact.financialDamage) },
    { name: 'Reputation damage', value: parseInt(businessImpact.reputationDamage) },
    { name: 'Non-Compliance', value: parseInt(businessImpact.nonCompliance) },
    { name: 'Privacy violation', value: parseInt(businessImpact.privacyViolation) },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center">OWASP Risk Assessment Calculator</CardTitle>
          <CardDescription className="text-center">
            Calculate risk factors based on OWASP Risk Rating Methodology
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <RadarChart data={radarData} />
            
            <div className="mt-4 text-center">
              <div className={`inline-block px-6 py-2 rounded-md font-bold text-white
                ${scores.severity === 'Critical' ? 'bg-red-700' : 
                  scores.severity === 'High' ? 'bg-red-600' :
                  scores.severity === 'Medium' ? 'bg-yellow-500' : 
                  scores.severity === 'Low' ? 'bg-green-600' : 'bg-gray-500'}`}>
                {scores.severity}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b">Threat Agent Factors</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="skill-level">Skill level</Label>
                  <Select 
                    value={threatFactors.skillLevel} 
                    onValueChange={(value) => handleFactorChange('threat', 'skillLevel', value)}
                  >
                    <SelectTrigger id="skill-level">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">No technical skills (1)</SelectItem>
                      <SelectItem value="3">Some technical skills (3)</SelectItem>
                      <SelectItem value="5">Advanced computer user (5)</SelectItem>
                      <SelectItem value="6">Network and programming skills (6)</SelectItem>
                      <SelectItem value="9">Security penetration skills (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="motive">Motive</Label>
                  <Select 
                    value={threatFactors.motive} 
                    onValueChange={(value) => handleFactorChange('threat', 'motive', value)}
                  >
                    <SelectTrigger id="motive">
                      <SelectValue placeholder="Select motive" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low or no reward (1)</SelectItem>
                      <SelectItem value="4">Possible reward (4)</SelectItem>
                      <SelectItem value="7">High reward (7)</SelectItem>
                      <SelectItem value="9">High reward (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="opportunity">Opportunity</Label>
                  <Select 
                    value={threatFactors.opportunity} 
                    onValueChange={(value) => handleFactorChange('threat', 'opportunity', value)}
                  >
                    <SelectTrigger id="opportunity">
                      <SelectValue placeholder="Select opportunity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Full access or expensive resources required (0)</SelectItem>
                      <SelectItem value="4">Special access or resources required (4)</SelectItem>
                      <SelectItem value="7">Some access or resources required (7)</SelectItem>
                      <SelectItem value="9">No access or resources required (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select 
                    value={threatFactors.size} 
                    onValueChange={(value) => handleFactorChange('threat', 'size', value)}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Developers (2)</SelectItem>
                      <SelectItem value="4">System administrators (4)</SelectItem>
                      <SelectItem value="5">Intranet users (5)</SelectItem>
                      <SelectItem value="6">Partners (6)</SelectItem>
                      <SelectItem value="9">Authenticated users (9)</SelectItem>
                      <SelectItem value="9">Anonymous Internet users (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4 mt-8 pb-2 border-b">Vulnerability Factors</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="ease-of-discovery">Ease of discovery</Label>
                  <Select 
                    value={vulnerabilityFactors.easeOfDiscovery} 
                    onValueChange={(value) => handleFactorChange('vulnerability', 'easeOfDiscovery', value)}
                  >
                    <SelectTrigger id="ease-of-discovery">
                      <SelectValue placeholder="Select ease of discovery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Practically impossible (1)</SelectItem>
                      <SelectItem value="3">Difficult (3)</SelectItem>
                      <SelectItem value="5">Easy (5)</SelectItem>
                      <SelectItem value="7">Automated tools available (7)</SelectItem>
                      <SelectItem value="9">Very easy (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="ease-of-exploit">Ease of exploit</Label>
                  <Select 
                    value={vulnerabilityFactors.easeOfExploit} 
                    onValueChange={(value) => handleFactorChange('vulnerability', 'easeOfExploit', value)}
                  >
                    <SelectTrigger id="ease-of-exploit">
                      <SelectValue placeholder="Select ease of exploit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Theoretical (1)</SelectItem>
                      <SelectItem value="3">Difficult (3)</SelectItem>
                      <SelectItem value="5">Easy (5)</SelectItem>
                      <SelectItem value="7">Automated tools available (7)</SelectItem>
                      <SelectItem value="9">Very easy (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="awareness">Awareness</Label>
                  <Select 
                    value={vulnerabilityFactors.awareness} 
                    onValueChange={(value) => handleFactorChange('vulnerability', 'awareness', value)}
                  >
                    <SelectTrigger id="awareness">
                      <SelectValue placeholder="Select awareness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Unknown (1)</SelectItem>
                      <SelectItem value="4">Hidden (4)</SelectItem>
                      <SelectItem value="6">Obvious (6)</SelectItem>
                      <SelectItem value="9">Public knowledge (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="intrusion-detection">Intrusion detection</Label>
                  <Select 
                    value={vulnerabilityFactors.intrusionDetection} 
                    onValueChange={(value) => handleFactorChange('vulnerability', 'intrusionDetection', value)}
                  >
                    <SelectTrigger id="intrusion-detection">
                      <SelectValue placeholder="Select intrusion detection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active detection in application (1)</SelectItem>
                      <SelectItem value="3">Logged and reviewed (3)</SelectItem>
                      <SelectItem value="5">Logged without review (5)</SelectItem>
                      <SelectItem value="8">Not logged (8)</SelectItem>
                      <SelectItem value="9">No detection (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b">Technical Impact Factors</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="loss-of-confidentiality">Loss of confidentiality</Label>
                  <Select 
                    value={technicalImpact.lossOfConfidentiality} 
                    onValueChange={(value) => handleFactorChange('technical', 'lossOfConfidentiality', value)}
                  >
                    <SelectTrigger id="loss-of-confidentiality">
                      <SelectValue placeholder="Select loss of confidentiality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Minimal non-sensitive data disclosed (2)</SelectItem>
                      <SelectItem value="6">Minimal critical data disclosed (6)</SelectItem>
                      <SelectItem value="7">Extensive non-sensitive data disclosed (7)</SelectItem>
                      <SelectItem value="9">All data disclosed (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="loss-of-integrity">Loss of integrity</Label>
                  <Select 
                    value={technicalImpact.lossOfIntegrity} 
                    onValueChange={(value) => handleFactorChange('technical', 'lossOfIntegrity', value)}
                  >
                    <SelectTrigger id="loss-of-integrity">
                      <SelectValue placeholder="Select loss of integrity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Minimal slightly corrupt data (1)</SelectItem>
                      <SelectItem value="3">Minimal seriously corrupt data (3)</SelectItem>
                      <SelectItem value="5">Extensive slightly corrupt data (5)</SelectItem>
                      <SelectItem value="7">Extensive seriously corrupt data (7)</SelectItem>
                      <SelectItem value="9">All data totally corrupt (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="loss-of-availability">Loss of availability</Label>
                  <Select 
                    value={technicalImpact.lossOfAvailability} 
                    onValueChange={(value) => handleFactorChange('technical', 'lossOfAvailability', value)}
                  >
                    <SelectTrigger id="loss-of-availability">
                      <SelectValue placeholder="Select loss of availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Minimal secondary services interrupted (1)</SelectItem>
                      <SelectItem value="5">Minimal primary services interrupted (5)</SelectItem>
                      <SelectItem value="7">Extensive secondary services interrupted (7)</SelectItem>
                      <SelectItem value="9">All services completely lost (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="loss-of-accountability">Loss of accountability</Label>
                  <Select 
                    value={technicalImpact.lossOfAccountability} 
                    onValueChange={(value) => handleFactorChange('technical', 'lossOfAccountability', value)}
                  >
                    <SelectTrigger id="loss-of-accountability">
                      <SelectValue placeholder="Select loss of accountability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Fully traceable (1)</SelectItem>
                      <SelectItem value="3">Possibly traceable (3)</SelectItem>
                      <SelectItem value="5">Limited tracking (5)</SelectItem>
                      <SelectItem value="7">Nearly anonymous (7)</SelectItem>
                      <SelectItem value="9">Completely anonymous (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-4 mt-8 pb-2 border-b">Business Impact Factors</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="financial-damage">Financial damage</Label>
                  <Select 
                    value={businessImpact.financialDamage} 
                    onValueChange={(value) => handleFactorChange('business', 'financialDamage', value)}
                  >
                    <SelectTrigger id="financial-damage">
                      <SelectValue placeholder="Select financial damage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Less than remediation cost (1)</SelectItem>
                      <SelectItem value="3">Effect on annual profit (3)</SelectItem>
                      <SelectItem value="7">Significant effect on annual profit (7)</SelectItem>
                      <SelectItem value="9">Bankruptcy (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reputation-damage">Reputation damage</Label>
                  <Select 
                    value={businessImpact.reputationDamage} 
                    onValueChange={(value) => handleFactorChange('business', 'reputationDamage', value)}
                  >
                    <SelectTrigger id="reputation-damage">
                      <SelectValue placeholder="Select reputation damage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Minimal damage (1)</SelectItem>
                      <SelectItem value="4">Loss of major accounts (4)</SelectItem>
                      <SelectItem value="5">Loss of goodwill (5)</SelectItem>
                      <SelectItem value="9">Brand damage (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="non-compliance">Non-compliance</Label>
                  <Select 
                    value={businessImpact.nonCompliance} 
                    onValueChange={(value) => handleFactorChange('business', 'nonCompliance', value)}
                  >
                    <SelectTrigger id="non-compliance">
                      <SelectValue placeholder="Select non-compliance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Minor violation (2)</SelectItem>
                      <SelectItem value="5">Clear violation (5)</SelectItem>
                      <SelectItem value="7">High profile violation (7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="privacy-violation">Privacy violation</Label>
                  <Select 
                    value={businessImpact.privacyViolation} 
                    onValueChange={(value) => handleFactorChange('business', 'privacyViolation', value)}
                  >
                    <SelectTrigger id="privacy-violation">
                      <SelectValue placeholder="Select privacy violation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">One individual (2)</SelectItem>
                      <SelectItem value="5">Hundreds of people (5)</SelectItem>
                      <SelectItem value="7">Thousands of people (7)</SelectItem>
                      <SelectItem value="9">Millions of people (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-md font-medium">Likelihood score</h3>
                <div className={`p-2 rounded-md text-center font-bold text-white
                  ${scores.likelihood < 3 ? 'bg-green-600' : 
                    scores.likelihood < 6 ? 'bg-yellow-500' : 
                    'bg-red-600'}`}>
                  {scores.likelihood.toFixed(3)} {scores.likelihood < 3 ? 'LOW' : scores.likelihood < 6 ? 'MEDIUM' : 'HIGH'}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-md font-medium">Impact score</h3>
                <div className={`p-2 rounded-md text-center font-bold text-white
                  ${scores.impact < 3 ? 'bg-green-600' : 
                    scores.impact < 6 ? 'bg-yellow-500' : 
                    'bg-red-600'}`}>
                  {scores.impact.toFixed(3)} {scores.impact < 3 ? 'LOW' : scores.impact < 6 ? 'MEDIUM' : 'HIGH'}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="block mb-2 text-md font-medium">VECTOR:</Label>
              <code className="block p-2 bg-muted/50 rounded-md text-sm font-mono w-full overflow-x-auto">
                {scores.vector}
              </code>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">How is Severity Risk calculated?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The OWASP Risk Rating Methodology is based on the Likelihood and Impact scores.</li>
                <li>Overall Risk Severity = Likelihood × Impact</li>
              </ul>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
