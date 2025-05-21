
import React from 'react';
import { CVSSScore } from "@/types/cvss";
import { getSeverityColorClass } from "@/lib/cvss";

interface ScoreDisplayProps {
  score: CVSSScore;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">CVSS Vector</h3>
        <div className="p-3 bg-muted/50 rounded-md overflow-x-auto">
          <code className="text-sm">{score.vector}</code>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="font-medium">Base Score</h3>
          <div className="text-3xl font-bold">
            <span className={getSeverityColorClass(score.baseSeverity)}>
              {score.baseScore}
            </span>
          </div>
          <div className={`text-sm font-medium ${getSeverityColorClass(score.baseSeverity)}`}>
            {score.baseSeverity}
          </div>
        </div>
        
        {score.temporalScore !== undefined && (
          <div className="space-y-2">
            <h3 className="font-medium">Temporal Score</h3>
            <div className="text-3xl font-bold">
              <span className={getSeverityColorClass(score.temporalSeverity)}>
                {score.temporalScore}
              </span>
            </div>
            <div className={`text-sm font-medium ${getSeverityColorClass(score.temporalSeverity)}`}>
              {score.temporalSeverity}
            </div>
          </div>
        )}
        
        {score.environmentalScore !== undefined && (
          <div className="space-y-2">
            <h3 className="font-medium">Environmental Score</h3>
            <div className="text-3xl font-bold">
              <span className={getSeverityColorClass(score.environmentalSeverity)}>
                {score.environmentalScore}
              </span>
            </div>
            <div className={`text-sm font-medium ${getSeverityColorClass(score.environmentalSeverity)}`}>
              {score.environmentalSeverity}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
