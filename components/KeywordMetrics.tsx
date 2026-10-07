
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { KeywordMetric, SERPFeature } from '../types';

interface Props {
  keywords: KeywordMetric[];
}

const SERPIcon: React.FC<{ type: SERPFeature; advice: string; details: string }> = ({ type, advice, details }) => {
  const getIcon = () => {
    switch (type) {
      case 'Featured Snippet': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />;
      case 'People Also Ask': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Image Pack': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case 'Video Carousel': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Knowledge Panel': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Local Pack': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />;
      case 'Top Stories': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z M7 8h4m-4 4h8m-8 4h8" />;
      default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />;
    }
  };

  return (
    <div className="group relative inline-block cursor-help">
      <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {getIcon()}
      </svg>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900 text-white p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 transform scale-95 group-hover:scale-100">
        <div className="font-bold text-xs mb-1 text-indigo-400 uppercase tracking-wide">{type}</div>
        <div className="font-medium text-[11px] mb-2">{advice}</div>
        <div className="text-[10px] opacity-70 leading-relaxed border-t border-white/10 pt-2">{details}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};

const KeywordMetrics: React.FC<Props> = ({ keywords }) => {
  const getIntentColor = (intent: string) => {
    switch (intent.toLowerCase()) {
      case 'informational': return 'bg-blue-100 text-blue-700';
      case 'transactional': return 'bg-emerald-100 text-emerald-700';
      case 'commercial': return 'bg-amber-100 text-amber-700';
      case 'navigational': return 'bg-purple-100 text-purple-700';
      case 'comparison': return 'bg-cyan-100 text-cyan-700';
      case 'educational': return 'bg-indigo-100 text-indigo-700';
      case 'local': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getDifficultyColor = (diff: number) => {
    if (diff < 30) return 'text-emerald-500';
    if (diff < 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Advanced Keyword & SERP Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keyword & Volume</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intent Profile</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">SERP Mix</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty Trend</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keywords.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 text-sm">{kw.keyword}</div>
                    <div className="text-xs text-slate-400">Vol: {(kw.volume * 1000).toLocaleString()} | CPC: ${kw.cpc}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 w-fit rounded-md text-[9px] font-bold uppercase ${getIntentColor(kw.intent)}`}>
                        {kw.intent}
                      </span>
                      <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${kw.intentConfidence}%` }}></div>
                      </div>
                      <span className="text-[9px] text-slate-400">{kw.intentConfidence}% confidence</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      {kw.serpFeatures?.map((f, idx) => (
                        <SERPIcon key={idx} type={f.type} advice={f.advice} details={f.details} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${getDifficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                      <div className="w-24 h-10">
                        {kw.difficultyTrend && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kw.difficultyTrend.map((v, idx) => ({ v, idx }))}>
                              <Line type="monotone" dataKey="v" stroke={kw.difficulty > 50 ? "#f43f5e" : "#10b981"} strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-28 h-10">
                      {kw.trend && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={kw.trend.map((v, idx) => ({ v, idx }))}>
                            <Area type="monotone" dataKey="v" stroke="#6366f1" fill="#e0e7ff" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordMetrics;
