
export interface OwaspFactors {
  // Threat Agent Factors
  skillLevel: string;
  motive: string;
  opportunity: string;
  size: string;
  
  // Vulnerability Factors
  easeOfDiscovery: string;
  easeOfExploit: string;
  awareness: string;
  intrusionDetection: string;
  
  // Technical Impact Factors
  lossOfConfidentiality: string;
  lossOfIntegrity: string;
  lossOfAvailability: string;
  lossOfAccountability: string;
  
  // Business Impact Factors
  financialDamage: string;
  reputationDamage: string;
  nonCompliance: string;
  privacyViolation: string;
}

export interface OwaspScore {
  likelihood: number;
  impact: number;
  overall: number;
  severity: string;
  vector: string;
}

export type OwaspVector = string;
