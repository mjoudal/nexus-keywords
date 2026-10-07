import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  savedCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, savedCount = 0 }) => {
  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      label: 'Global Explorer',
      desc: 'Seed & SERP Intel',
    },
    {
      id: 'competitor' as ViewMode,
      icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      label: 'Competitor Gap',
      desc: 'SERP Outranking',
    },
    {
      id: 'local' as ViewMode,
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      label: 'Local SEO',
      desc: 'Google Maps 3-Pack',
    },
    {
      id: 'backlinks' as ViewMode,
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      label: 'Link Building',
      desc: 'High-DR Outreach',
    },
    {
      id: 'content' as ViewMode,
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      label: 'E-E-A-T Writer',
      desc: '1,200+ Word Articles',
    },
    {
      id: 'strategy' as ViewMode,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      label: 'Strategy AI',
      desc: 'Topic Cluster Matrix',
    },
    {
      id: 'saved' as ViewMode,
      icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
      label: 'Saved Basket',
      desc: 'Curated Keyword List',
      badge: savedCount,
    },
    {
      id: 'roi' as ViewMode,
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      label: 'ROI Simulator',
      desc: 'Traffic & Revenue Model',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0 shrink-0 select-none">
      <div className="p-5 flex-1 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 tracking-tight block">
              KeywordNexus
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block -mt-1">
              AI Intelligence
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <div className="text-left">
                    <span className="block leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] block leading-tight font-normal ${
                        isActive ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Card */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="p-3.5 bg-slate-900 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini Engine
            </span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded font-mono">
              3.8 Flash
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200">SERP &amp; Maps Grounded</p>
          <div className="mt-2 text-[10px] text-slate-400">
            Real-time organic search &amp; Maps retrieval active.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
