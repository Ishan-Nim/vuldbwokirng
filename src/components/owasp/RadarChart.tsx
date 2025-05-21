
import React from 'react';
import { ResponsiveContainer, RadarChart as RechartsRadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface RadarChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" fontSize={10} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} />
          <Radar
            name="Risk Factor"
            dataKey="value"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
