
import { BaseMetricGroup, TemporalMetricGroup, EnvironmentalMetricGroup, CVSSScore } from "@/types/cvss";

// CVSS 3.1 Weights
const WEIGHTS = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
  AC: { L: 0.77, H: 0.44 },
  PR: { 
    N: 0.85, 
    L: { U: 0.62, C: 0.68 },
    H: { U: 0.27, C: 0.5 }
  },
  UI: { N: 0.85, R: 0.62 },
  S: { U: 0, C: 1 }, // Used for calculation branch, not direct value
  C: { H: 0.56, L: 0.22, N: 0 },
  I: { H: 0.56, L: 0.22, N: 0 },
  A: { H: 0.56, L: 0.22, N: 0 },
  E: { X: 1, H: 1, F: 0.97, P: 0.94, U: 0.91 },
  RL: { X: 1, U: 1, W: 0.97, T: 0.96, O: 0.95 },
  RC: { X: 1, C: 1, R: 0.96, U: 0.92 },
  CR: { X: 1, H: 1.5, M: 1, L: 0.5 },
  IR: { X: 1, H: 1.5, M: 1, L: 0.5 },
  AR: { X: 1, H: 1.5, M: 1, L: 0.5 }
};

// Calculate Base Score
export function calculateBaseScore(metrics: BaseMetricGroup): { score: number; severity: CVSSScore['baseSeverity'] } {
  const av = WEIGHTS.AV[metrics.attackVector];
  const ac = WEIGHTS.AC[metrics.attackComplexity];
  
  // PR depends on Scope
  const pr = typeof WEIGHTS.PR[metrics.privilegesRequired] === 'object' 
    ? WEIGHTS.PR[metrics.privilegesRequired][metrics.scope]
    : WEIGHTS.PR[metrics.privilegesRequired];
    
  const ui = WEIGHTS.UI[metrics.userInteraction];
  
  const c = WEIGHTS.C[metrics.confidentiality];
  const i = WEIGHTS.I[metrics.integrity];
  const a = WEIGHTS.A[metrics.availability];
  
  // Calculate Impact
  let impact: number;
  if (metrics.scope === 'U') {
    impact = 6.42 * Math.max(0, c + i + a);
  } else {
    impact = 7.52 * Math.max(0, c + i + a) - 3.25 * Math.pow(Math.max(0, c + i + a) - 0.029, 15);
  }
  
  // Calculate Exploitability
  const exploitability = 8.22 * av * ac * pr * ui;
  
  // Calculate Base Score
  let baseScore: number;
  if (impact <= 0) {
    baseScore = 0;
  } else if (metrics.scope === 'U') {
    baseScore = Math.min(impact + exploitability, 10);
  } else {
    baseScore = Math.min(1.08 * (impact + exploitability), 10);
  }
  
  // Round up to nearest tenth
  baseScore = Math.ceil(baseScore * 10) / 10;
  
  // Determine severity
  let severity: CVSSScore['baseSeverity'];
  if (baseScore === 0) severity = 'None';
  else if (baseScore < 4.0) severity = 'Low';
  else if (baseScore < 7.0) severity = 'Medium';
  else if (baseScore < 9.0) severity = 'High';
  else severity = 'Critical';
  
  return { score: baseScore, severity };
}

// Calculate Temporal Score
export function calculateTemporalScore(
  baseScore: number, 
  metrics: TemporalMetricGroup
): { score: number; severity: CVSSScore['temporalSeverity'] } {
  const e = WEIGHTS.E[metrics.exploitCodeMaturity];
  const rl = WEIGHTS.RL[metrics.remediationLevel];
  const rc = WEIGHTS.RC[metrics.reportConfidence];
  
  let temporalScore = baseScore * e * rl * rc;
  
  // Round up to nearest tenth
  temporalScore = Math.ceil(temporalScore * 10) / 10;
  
  // Determine severity
  let severity: CVSSScore['temporalSeverity'];
  if (temporalScore === 0) severity = 'None';
  else if (temporalScore < 4.0) severity = 'Low';
  else if (temporalScore < 7.0) severity = 'Medium';
  else if (temporalScore < 9.0) severity = 'High';
  else severity = 'Critical';
  
  return { score: temporalScore, severity };
}

// Calculate Environmental Score
export function calculateEnvironmentalScore(
  baseMetrics: BaseMetricGroup,
  envMetrics: EnvironmentalMetricGroup
): { score: number; severity: CVSSScore['environmentalSeverity'] } {
  // Modified metrics - use provided or fall back to base values
  const mAV = envMetrics.modifiedAttackVector === 'X' ? baseMetrics.attackVector : envMetrics.modifiedAttackVector;
  const mAC = envMetrics.modifiedAttackComplexity === 'X' ? baseMetrics.attackComplexity : envMetrics.modifiedAttackComplexity;
  const mPR = envMetrics.modifiedPrivilegesRequired === 'X' ? baseMetrics.privilegesRequired : envMetrics.modifiedPrivilegesRequired;
  const mUI = envMetrics.modifiedUserInteraction === 'X' ? baseMetrics.userInteraction : envMetrics.modifiedUserInteraction;
  const mS = envMetrics.modifiedScope === 'X' ? baseMetrics.scope : envMetrics.modifiedScope;
  const mC = envMetrics.modifiedConfidentiality === 'X' ? baseMetrics.confidentiality : envMetrics.modifiedConfidentiality;
  const mI = envMetrics.modifiedIntegrity === 'X' ? baseMetrics.integrity : envMetrics.modifiedIntegrity;
  const mA = envMetrics.modifiedAvailability === 'X' ? baseMetrics.availability : envMetrics.modifiedAvailability;
  
  const cr = WEIGHTS.CR[envMetrics.confidentialityRequirement];
  const ir = WEIGHTS.IR[envMetrics.integrityRequirement];
  const ar = WEIGHTS.AR[envMetrics.availabilityRequirement];
  
  const mav = WEIGHTS.AV[mAV];
  const mac = WEIGHTS.AC[mAC];
  
  // MPR depends on Modified Scope
  const mpr = typeof WEIGHTS.PR[mPR] === 'object' 
    ? WEIGHTS.PR[mPR][mS]
    : WEIGHTS.PR[mPR];
    
  const mui = WEIGHTS.UI[mUI];
  
  const mc = WEIGHTS.C[mC] * cr;
  const mi = WEIGHTS.I[mI] * ir;
  const ma = WEIGHTS.A[mA] * ar;
  
  // Calculate Modified Impact
  let modifiedImpact: number;
  if (mS === 'U') {
    modifiedImpact = 6.42 * Math.max(0, mc + mi + ma);
  } else {
    modifiedImpact = 7.52 * Math.max(0, mc + mi + ma) - 3.25 * Math.pow(Math.max(0, mc + mi + ma) - 0.029, 15);
  }
  
  // Calculate Modified Exploitability
  const modifiedExploitability = 8.22 * mav * mac * mpr * mui;
  
  // Calculate Environmental Score
  let envScore: number;
  if (modifiedImpact <= 0) {
    envScore = 0;
  } else if (mS === 'U') {
    envScore = Math.min(modifiedImpact + modifiedExploitability, 10);
  } else {
    envScore = Math.min(1.08 * (modifiedImpact + modifiedExploitability), 10);
  }
  
  // Round up to nearest tenth
  envScore = Math.ceil(envScore * 10) / 10;
  
  // Determine severity
  let severity: CVSSScore['environmentalSeverity'];
  if (envScore === 0) severity = 'None';
  else if (envScore < 4.0) severity = 'Low';
  else if (envScore < 7.0) severity = 'Medium';
  else if (envScore < 9.0) severity = 'High';
  else severity = 'Critical';
  
  return { score: envScore, severity };
}

// Generate CVSS Vector String
export function generateVectorString(
  base: BaseMetricGroup,
  temporal?: TemporalMetricGroup,
  environmental?: EnvironmentalMetricGroup
): string {
  let vector = `CVSS:3.1/AV:${base.attackVector}/AC:${base.attackComplexity}/PR:${base.privilegesRequired}/UI:${base.userInteraction}/S:${base.scope}/C:${base.confidentiality}/I:${base.integrity}/A:${base.availability}`;
  
  if (temporal) {
    vector += `/E:${temporal.exploitCodeMaturity}/RL:${temporal.remediationLevel}/RC:${temporal.reportConfidence}`;
  }
  
  if (environmental) {
    vector += `/CR:${environmental.confidentialityRequirement}/IR:${environmental.integrityRequirement}/AR:${environmental.availabilityRequirement}`;
    vector += `/MAV:${environmental.modifiedAttackVector}/MAC:${environmental.modifiedAttackComplexity}/MPR:${environmental.modifiedPrivilegesRequired}/MUI:${environmental.modifiedUserInteraction}/MS:${environmental.modifiedScope}/MC:${environmental.modifiedConfidentiality}/MI:${environmental.modifiedIntegrity}/MA:${environmental.modifiedAvailability}`;
  }
  
  return vector;
}

// Parse CVSS Vector String
export function parseVectorString(vector: string): {
  base: BaseMetricGroup;
  temporal?: TemporalMetricGroup;
  environmental?: EnvironmentalMetricGroup;
} {
  const parts = vector.replace('CVSS:3.1/', '').split('/');
  const metrics: any = {};
  
  parts.forEach(part => {
    const [key, value] = part.split(':');
    metrics[key] = value;
  });
  
  const base: BaseMetricGroup = {
    attackVector: metrics.AV as any,
    attackComplexity: metrics.AC as any,
    privilegesRequired: metrics.PR as any,
    userInteraction: metrics.UI as any,
    scope: metrics.S as any,
    confidentiality: metrics.C as any,
    integrity: metrics.I as any,
    availability: metrics.A as any,
  };
  
  let temporal: TemporalMetricGroup | undefined;
  if (metrics.E && metrics.RL && metrics.RC) {
    temporal = {
      exploitCodeMaturity: metrics.E as any,
      remediationLevel: metrics.RL as any,
      reportConfidence: metrics.RC as any,
    };
  }
  
  let environmental: EnvironmentalMetricGroup | undefined;
  if (
    metrics.CR && metrics.IR && metrics.AR &&
    metrics.MAV && metrics.MAC && metrics.MPR && metrics.MUI &&
    metrics.MS && metrics.MC && metrics.MI && metrics.MA
  ) {
    environmental = {
      confidentialityRequirement: metrics.CR as any,
      integrityRequirement: metrics.IR as any,
      availabilityRequirement: metrics.AR as any,
      modifiedAttackVector: metrics.MAV as any,
      modifiedAttackComplexity: metrics.MAC as any,
      modifiedPrivilegesRequired: metrics.MPR as any,
      modifiedUserInteraction: metrics.MUI as any,
      modifiedScope: metrics.MS as any,
      modifiedConfidentiality: metrics.MC as any,
      modifiedIntegrity: metrics.MI as any,
      modifiedAvailability: metrics.MA as any,
    };
  }
  
  return { base, temporal, environmental };
}

// Calculate Complete CVSS Score
export function calculateCVSSScore(
  base: BaseMetricGroup,
  temporal?: TemporalMetricGroup,
  environmental?: EnvironmentalMetricGroup
): CVSSScore {
  const baseResult = calculateBaseScore(base);
  const vector = generateVectorString(base, temporal, environmental);
  
  const result: CVSSScore = {
    baseScore: baseResult.score,
    baseSeverity: baseResult.severity,
    vector: vector
  };
  
  if (temporal) {
    const temporalResult = calculateTemporalScore(baseResult.score, temporal);
    result.temporalScore = temporalResult.score;
    result.temporalSeverity = temporalResult.severity;
  }
  
  if (environmental) {
    const environmentalResult = calculateEnvironmentalScore(base, environmental);
    result.environmentalScore = environmentalResult.score;
    result.environmentalSeverity = environmentalResult.severity;
  }
  
  return result;
}

// Get severity color class based on score
export function getSeverityColorClass(severity: string | undefined): string {
  if (!severity) return '';
  
  switch (severity) {
    case 'Critical':
      return 'text-severity-critical';
    case 'High':
      return 'text-severity-high';
    case 'Medium':
      return 'text-severity-medium';
    case 'Low':
      return 'text-severity-low';
    default:
      return '';
  }
}

// Get background color class based on score
export function getSeverityBgClass(severity: string | undefined): string {
  if (!severity) return '';
  
  switch (severity) {
    case 'Critical':
      return 'bg-red-600 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-yellow-500 text-white';
    case 'Low':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}
