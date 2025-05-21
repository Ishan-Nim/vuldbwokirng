
// CVSS 3.1 Metrics and Scoring Types

export type BaseMetricGroup = {
  attackVector: 'N' | 'A' | 'L' | 'P';
  attackComplexity: 'L' | 'H';
  privilegesRequired: 'N' | 'L' | 'H';
  userInteraction: 'N' | 'R';
  scope: 'U' | 'C';
  confidentiality: 'H' | 'L' | 'N';
  integrity: 'H' | 'L' | 'N';
  availability: 'H' | 'L' | 'N';
};

export type TemporalMetricGroup = {
  exploitCodeMaturity: 'X' | 'H' | 'F' | 'P' | 'U';
  remediationLevel: 'X' | 'U' | 'W' | 'T' | 'O';
  reportConfidence: 'X' | 'C' | 'R' | 'U';
};

export type EnvironmentalMetricGroup = {
  confidentialityRequirement: 'X' | 'H' | 'M' | 'L';
  integrityRequirement: 'X' | 'H' | 'M' | 'L';
  availabilityRequirement: 'X' | 'H' | 'M' | 'L';
  modifiedAttackVector: 'X' | 'N' | 'A' | 'L' | 'P';
  modifiedAttackComplexity: 'X' | 'L' | 'H';
  modifiedPrivilegesRequired: 'X' | 'N' | 'L' | 'H';
  modifiedUserInteraction: 'X' | 'N' | 'R';
  modifiedScope: 'X' | 'U' | 'C';
  modifiedConfidentiality: 'X' | 'H' | 'L' | 'N';
  modifiedIntegrity: 'X' | 'H' | 'L' | 'N';
  modifiedAvailability: 'X' | 'H' | 'L' | 'N';
};

export type CVSSScore = {
  baseScore: number;
  baseSeverity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  temporalScore?: number;
  temporalSeverity?: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  environmentalScore?: number;
  environmentalSeverity?: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  vector: string;
};

export type CVSSState = {
  base: BaseMetricGroup;
  temporal: TemporalMetricGroup;
  environmental: EnvironmentalMetricGroup;
};
