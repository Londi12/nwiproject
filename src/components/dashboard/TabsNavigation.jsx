import React from 'react';

const TABS = ["Overview", "Leads", "Applications", "Tasks", "Calls", "Documents", "CV Tools", "Completed"];

export default function TabsNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 flex-shrink-0 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
