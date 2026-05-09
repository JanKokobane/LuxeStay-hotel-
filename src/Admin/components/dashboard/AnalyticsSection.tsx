// components/dashboard/AnalyticsSection.tsx
import React from 'react';

export interface AnalyticsSectionProps {
  detailed?: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ detailed }) => {
  return (
    <div>
      <h2>Analytics Section</h2>
      {detailed && <p>Showing detailed analytics...</p>}
    </div>
  );
};

export default AnalyticsSection;
