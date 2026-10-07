
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Global Explorer' },
    { id: 'competitor' as ViewMode, icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Competitor Gap' },
    { id: 'local' as ViewMode, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Local SEO' },
    { id: 'backlinks' as ViewMode, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', label: 'Link Building' },
    { id: 'content' as ViewMode, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: 'Content Gen (E-E-A-T)' },
    { id: 'strategy' as ViewMode, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Strategy AI' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">KeywordNexus</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Power Mode</p>
          <p className="text-sm font-medium">Gemini 3.0 Pro</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-white rounded-full"></div>
            </div>
            <span className="text-[10px]">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
