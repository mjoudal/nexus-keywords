import React, { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line } from 'recharts';
import { KeywordMetric, SERPFeature, SeedOverview } from '../types';

interface Props {
  keywords: KeywordMetric[];
  overview?: SeedOverview;
  questions?: KeywordMetric[];
  longTail?: KeywordMetric[];
  onSaveKeyword?: (kw: KeywordMetric) => void;
  isSaved?: (kw: string) => boolean;
  onGenerateContentForKeyword?: (kw: string) => void;
  onAnalyzeCompetitorForKeyword?: (kw: string) => void;
}

const SERPIcon: React.FC<{ type: SERPFeature; advice: string; details: string }> = ({ type, advice, details }) => {
  const getIcon = () => {
    switch (type) {
      case 'Featured Snippet':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />;
      case 'People Also Ask':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Image Pack':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case 'Video Carousel':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Knowledge Panel':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'Local Pack':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />;
      case 'Top Stories':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z M7 8h4m-4 4h8m-8 4h8" />;
      case 'Site Links':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />;
      case 'Shopping Ads':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />;
    }
  };

  return (
    <div className="group relative inline-block cursor-help">
      <div className="p-1 rounded-md hover:bg-slate-100 transition-colors">
        <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {getIcon()}
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 text-white p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 transform scale-95 group-hover:scale-100 text-left">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-xs text-indigo-400 uppercase tracking-wide">{type}</span>
          <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded">SERP Feature</span>
        </div>
        <div className="font-medium text-[11px] text-slate-200 mb-1.5">{advice}</div>
        <div className="text-[10px] text-slate-400 leading-relaxed border-t border-white/10 pt-1.5">{details}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};

const getIntentBadge = (intent: string) => {
  const norm = (intent || '').toLowerCase();
  if (norm.includes('info')) return 'bg-sky-50 text-sky-700 border-sky-200';
  if (norm.includes('trans')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (norm.includes('comm')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (norm.includes('nav')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (norm.includes('comp')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (norm.includes('local')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getDifficultyStyle = (diff: number) => {
  if (diff < 30) return { label: 'Easy', text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' };
  if (diff < 60) return { label: 'Medium', text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' };
  if (diff < 80) return { label: 'Hard', text: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500' };
  return { label: 'Very Hard', text: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-500' };
};

const KeywordMetrics: React.FC<Props> = ({
  keywords,
  overview,
  questions = [],
  longTail = [],
  onSaveKeyword,
  isSaved,
  onGenerateContentForKeyword,
  onAnalyzeCompetitorForKeyword,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'longtail'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Combine lists according to active tab
  const baseList = useMemo(() => {
    if (activeTab === 'questions') return questions.length > 0 ? questions : keywords.filter(k => k.category === 'Question' || k.keyword.toLowerCase().match(/^(how|what|why|where|when|can|is|are|which)\b/));
    if (activeTab === 'longtail') return longTail.length > 0 ? longTail : keywords.filter(k => k.category === 'Long-Tail' || k.keyword.split(' ').length >= 3);
    return keywords;
  }, [activeTab, keywords, questions, longTail]);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return baseList.filter((kw) => {
      const matchesSearch = kw.keyword.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIntent = intentFilter === 'all' || (kw.intent || '').toLowerCase().includes(intentFilter.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === 'all' ||
        (difficultyFilter === 'easy' && kw.difficulty < 30) ||
        (difficultyFilter === 'medium' && kw.difficulty >= 30 && kw.difficulty < 60) ||
        (difficultyFilter === 'hard' && kw.difficulty >= 60);

      return matchesSearch && matchesIntent && matchesDifficulty;
    });
  }, [baseList, searchTerm, intentFilter, difficultyFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const header = ['Keyword', 'Monthly Volume', 'Keyword Difficulty', 'CPC ($)', 'Intent', 'Intent Confidence (%)'];
    const rows = filteredKeywords.map((k) => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      Math.round(k.volume * 1000),
      k.difficulty,
      k.cpc,
      `"${k.intent}"`,
      k.intentConfidence || 85,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `keywords-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  const handleCopyClipboard = () => {
    const text = filteredKeywords.map(k => `${k.keyword}\t${Math.round(k.volume * 1000)}\t${k.difficulty}\t$${k.cpc}\t${k.intent}`).join('\n');
    navigator.clipboard.writeText(`Keyword\tVolume\tKD\tCPC\tIntent\n${text}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards if available */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Search Volume</span>
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {Math.round(overview.volume * 1000).toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1.5">/ mo</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span>● Organic CTR: {overview.organicCtr || 68}%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Keyword Difficulty</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyStyle(overview.difficulty).bg} ${getDifficultyStyle(overview.difficulty).text}`}>
                {overview.difficultyLabel || getDifficultyStyle(overview.difficulty).label}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-2">
              <span>{overview.difficulty}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${getDifficultyStyle(overview.difficulty).bar}`} style={{ width: `${overview.difficulty}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Est. CPC</span>
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              ${Number(overview.cpc || 0).toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1.5">USD</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              Competition Index: {overview.competitionIndex !== undefined ? Math.round(overview.competitionIndex * 100) : 64}%
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Primary Intent</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getIntentBadge(String(overview.primaryIntent))}`}>
                {String(overview.primaryIntent)}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">
              {overview.intentConfidence || 92}%
              <span className="text-xs font-normal text-slate-400 ml-1">confidence</span>
            </div>
            {overview.intentDistribution ? (
              <div className="mt-2 flex h-1.5 w-full rounded-full overflow-hidden gap-0.5">
                <div style={{ width: `${overview.intentDistribution.informational}%` }} className="bg-sky-500" title="Informational"></div>
                <div style={{ width: `${overview.intentDistribution.commercial}%` }} className="bg-amber-500" title="Commercial"></div>
                <div style={{ width: `${overview.intentDistribution.transactional}%` }} className="bg-emerald-500" title="Transactional"></div>
                <div style={{ width: `${overview.intentDistribution.navigational}%` }} className="bg-purple-500" title="Navigational"></div>
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-slate-400">High transactional velocity</div>
            )}
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Navigation Tabs and Action Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Suggestions ({keywords.length})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Questions & PAA ({questions.length || keywords.filter(k => k.category === 'Question').length})
            </button>
            <button
              onClick={() => setActiveTab('longtail')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'longtail'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Long-Tail ({longTail.length || keywords.filter(k => k.category === 'Long-Tail').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy to clipboard (TSV format)"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copiedNotification ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download CSV file"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter keyword phrases..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="font-medium">Intent:</span>
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none"
              >
                <option value="all">All Intents</option>
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="navigational">Navigational</option>
                <option value="comparison">Comparison</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="font-medium">Difficulty:</span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none"
              >
                <option value="all">Any KD</option>
                <option value="easy">Easy (&lt; 30)</option>
                <option value="medium">Medium (30 - 60)</option>
                <option value="hard">Hard (&gt; 60)</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 ml-2">
              Showing {filteredKeywords.length} of {baseList.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1020px]">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-8">Save</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Keyword & Category</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Search Volume</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Intent Profile</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Difficulty & Trend</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">SERP Features</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Volume Trend</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No keywords matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw, i) => {
                  const diffStyle = getDifficultyStyle(kw.difficulty);
                  const saved = isSaved ? isSaved(kw.keyword) : false;

                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Save bookmark */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => onSaveKeyword && onSaveKeyword(kw)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            saved ? 'text-amber-500 hover:text-amber-600 bg-amber-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                          }`}
                          title={saved ? 'Remove from Saved Basket' : 'Save to Keyword Basket'}
                        >
                          <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </td>

                      {/* Keyword Name */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <span>{kw.keyword}</span>
                          {kw.category && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                              {kw.category}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Est. CPC: ${kw.cpc ? Number(kw.cpc).toFixed(2) : '1.20'}
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="font-bold text-slate-800 text-sm">
                          {Math.round(kw.volume * 1000).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">searches/mo</div>
                      </td>

                      {/* Intent */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 w-fit rounded-md text-[10px] font-bold uppercase border ${getIntentBadge(String(kw.intent))}`}>
                            {String(kw.intent)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${kw.intentConfidence || 85}%` }}></div>
                            </div>
                            <span className="text-[9px] text-slate-400">{kw.intentConfidence || 85}%</span>
                          </div>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className={`font-bold text-sm ${diffStyle.text}`}>{kw.difficulty}</span>
                            <span className="text-[9px] text-slate-400">{diffStyle.label}</span>
                          </div>
                          <div className="w-16 h-8">
                            {kw.difficultyTrend && kw.difficultyTrend.length > 0 && (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={kw.difficultyTrend.map((v, idx) => ({ v, idx }))}>
                                  <Line type="monotone" dataKey="v" stroke={kw.difficulty > 50 ? '#f43f5e' : '#10b981'} strokeWidth={1.5} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SERP Features */}
                      <td className="px-5 py-3.5">
                        <div className="flex justify-center items-center gap-1 flex-wrap max-w-[130px] mx-auto">
                          {kw.serpFeatures && kw.serpFeatures.length > 0 ? (
                            kw.serpFeatures.map((f, idx) => (
                              <SERPIcon key={idx} type={f.type} advice={f.advice} details={f.details} />
                            ))
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* Volume Trend Sparkline */}
                      <td className="px-5 py-3.5">
                        <div className="w-20 h-7">
                          {kw.trend && kw.trend.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={kw.trend.map((v, idx) => ({ v, idx }))}>
                                <Area type="monotone" dataKey="v" stroke="#6366f1" fill="#e0e7ff" />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onGenerateContentForKeyword && (
                            <button
                              onClick={() => onGenerateContentForKeyword(kw.keyword)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Write E-E-A-T article for this keyword"
                            >
                              <span>Write</span>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                          {onAnalyzeCompetitorForKeyword && (
                            <button
                              onClick={() => onAnalyzeCompetitorForKeyword(kw.keyword)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                              title="Analyze competitor gap for this keyword"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordMetrics;
