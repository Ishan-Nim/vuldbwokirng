
import { OwaspFactors, OwaspScore, OwaspVector } from "@/types/owasp";

export function calculateOwaspRisk(factors: OwaspFactors): OwaspScore {
  // Calculate Threat Agent factors average
  const threatAgentScore = (
    parseFloat(factors.skillLevel) +
    parseFloat(factors.motive) +
    parseFloat(factors.opportunity) +
    parseFloat(factors.size)
  ) / 4.0;
  
  // Calculate Vulnerability factors average
  const vulnerabilityScore = (
    parseFloat(factors.easeOfDiscovery) +
    parseFloat(factors.easeOfExploit) +
    parseFloat(factors.awareness) +
    parseFloat(factors.intrusionDetection)
  ) / 4.0;
  
  // Calculate Technical Impact factors average
  const technicalImpactScore = (
    parseFloat(factors.lossOfConfidentiality) +
    parseFloat(factors.lossOfIntegrity) +
    parseFloat(factors.lossOfAvailability) +
    parseFloat(factors.lossOfAccountability)
  ) / 4.0;
  
  // Calculate Business Impact factors average
  const businessImpactScore = (
    parseFloat(factors.financialDamage) +
    parseFloat(factors.reputationDamage) +
    parseFloat(factors.nonCompliance) +
    parseFloat(factors.privacyViolation)
  ) / 4.0;
  
  // Calculate Likelihood and Impact
  const likelihood = (threatAgentScore + vulnerabilityScore) / 2;
  const impact = (technicalImpactScore + businessImpactScore) / 2;
  
  // Calculate Overall Risk
  const overall = likelihood * impact;
  
  // Determine severity based on overall score
  let severity: string;
  if (overall < 3) {
    severity = "Low";
  } else if (overall < 6) {
    severity = "Medium";
  } else if (overall < 9) {
    severity = "High";
  } else {
    severity = "Critical";
  }
  
  // Generate OWASP vector
  const vector = generateOwaspVector(factors);
  
  return {
    likelihood,
    impact,
    overall,
    severity,
    vector
  };
}

export function generateOwaspVector(factors: OwaspFactors): string {
  // Format: (SL:X/M:X/O:X/S:X/ED:X/EE:X/A:X/ID:X/LC:X/LI:X/LA:X/LAC:X/FD:X/RD:X/NC:X/PV:X)
  return `(SL:${factors.skillLevel}/M:${factors.motive}/O:${factors.opportunity}/S:${factors.size}/` +
    `ED:${factors.easeOfDiscovery}/EE:${factors.easeOfExploit}/A:${factors.awareness}/ID:${factors.intrusionDetection}/` +
    `LC:${factors.lossOfConfidentiality}/LI:${factors.lossOfIntegrity}/LA:${factors.lossOfAvailability}/LAC:${factors.lossOfAccountability}/` +
    `FD:${factors.financialDamage}/RD:${factors.reputationDamage}/NC:${factors.nonCompliance}/PV:${factors.privacyViolation})`;
}

export function parseOwaspVector(vector: string): OwaspFactors | null {
  try {
    // Remove parentheses and split by "/"
    const cleanVector = vector.replace(/[()]/g, '');
    const parts = cleanVector.split('/');
    
    const factors: Partial<OwaspFactors> = {};
    
    parts.forEach(part => {
      const [key, value] = part.split(':');
      
      switch (key) {
        case 'SL':
          factors.skillLevel = value;
          break;
        case 'M':
          factors.motive = value;
          break;
        case 'O':
          factors.opportunity = value;
          break;
        case 'S':
          factors.size = value;
          break;
        case 'ED':
          factors.easeOfDiscovery = value;
          break;
        case 'EE':
          factors.easeOfExploit = value;
          break;
        case 'A':
          factors.awareness = value;
          break;
        case 'ID':
          factors.intrusionDetection = value;
          break;
        case 'LC':
          factors.lossOfConfidentiality = value;
          break;
        case 'LI':
          factors.lossOfIntegrity = value;
          break;
        case 'LA':
          factors.lossOfAvailability = value;
          break;
        case 'LAC':
          factors.lossOfAccountability = value;
          break;
        case 'FD':
          factors.financialDamage = value;
          break;
        case 'RD':
          factors.reputationDamage = value;
          break;
        case 'NC':
          factors.nonCompliance = value;
          break;
        case 'PV':
          factors.privacyViolation = value;
          break;
      }
    });
    
    // Check if all required factors are present
    if (Object.keys(factors).length === 16) {
      return factors as OwaspFactors;
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing OWASP vector:", error);
    return null;
  }
}
