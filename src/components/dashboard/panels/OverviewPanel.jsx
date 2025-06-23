import React from 'react';
import QuickActions from '../QuickActions';
import RecentActivity from '../RecentActivity';

export default function OverviewPanel({ setActiveTab, onNavigate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <QuickActions onNavigate={onNavigate} setActiveTab={setActiveTab} />
      </div>
      <div className="lg:col-span-1">
        <RecentActivity />
      </div>
    </div>
  );
}
