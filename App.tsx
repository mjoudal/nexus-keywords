import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import KeywordMetrics from './components/KeywordMetrics';
import ContentGenerator from './components/ContentGenerator';
import CompetitorView from './components/CompetitorView';
import LocalSEOView from './components/LocalSEOView';
import StrategyView from './components/StrategyView';
import RoiCalculator from './components/RoiCalculator';
import SavedKeywordsView from './components/SavedKeywordsView';
import {
  ViewMode,
  KeywordAnalysis,
  LocalKeywordAnalysis,
  CompetitorInsight,
  BacklinkOpportunity,
  ContentStrategyMatrix,
  SavedKeyword,
  KeywordMetric,
} from './types';
import {
  analyzeKeyword,
  analyzeLocalKeywords,
  generateContentStrategy,
  analyzeCompetitorGap,
  suggestBacklinks,
} from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const QUICK_SEEDS = [
  { keyword: 'b2b saas marketing', label: 'B2B SaaS Marketing' },
  { keyword: 'ai workflow automation', label: 'AI Workflow Automation' },
  { keyword: 'emergency plumbing services', label: 'Emergency Plumbing' },
  { keyword: 'best crm software for startups', label: 'Startup CRM' },
  { keyword: 'electric vehicle charging stations', label: 'EV Charging' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [query, setQuery] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data states
  const [data, setData] = useState<KeywordAnalysis | null>(null);
  const [localData, setLocalData] = useState<LocalKeywordAnalysis | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorInsight[] | null>(null);
  const [backlinkData, setBacklinkData] = useState<BacklinkOpportunity[] | null>(null);
  const [strategy, setStrategy] = useState<ContentStrategyMatrix | null>(null);
  const [contentKeyword, setContentKeyword] = useState<string>('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Pitch template copy notification
  const [copiedPitchIdx, setCopiedPitchIdx] = useState<number | null>(null);

  // Saved keywords basket (synced with localStorage)
  const [savedKeywords, setSavedKeywords] = useState<SavedKeyword[]>(() => {
    try {
      const saved = localStorage.getItem('keywordnexus_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('keywordnexus_saved', JSON.stringify(savedKeywords));
    } catch (e) {
      console.warn('Could not persist saved keywords', e);
    }
  }, [savedKeywords]);

  // Request browser geolocation for local SEO
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.log('Geolocation permission skipped or unavailable:', err.message);
        }
      );
    }
  }, []);

  // Save / Toggle Keyword in Basket
  const handleToggleSave = (kw: KeywordMetric) => {
    setSavedKeywords((prev) => {
      const exists = prev.some((k) => k.keyword.toLowerCase() === kw.keyword.toLowerCase());
      if (exists) {
        return prev.filter((k) => k.keyword.toLowerCase() !== kw.keyword.toLowerCase());
      } else {
        const item: SavedKeyword = {
          keyword: kw.keyword,
          volume: kw.volume,
          difficulty: kw.difficulty,
          cpc: kw.cpc || 0,
          intent: String(kw.intent),
          savedAt: new Date().toLocaleDateString(),
        };
        return [item, ...prev];
      }
    });
  };

  const isKeywordSaved = (keyword: string) => {
    return savedKeywords.some((k) => k.keyword.toLowerCase() === keyword.toLowerCase());
  };

  const handleRemoveSaved = (keyword: string) => {
    setSavedKeywords((prev) => prev.filter((k) => k.keyword.toLowerCase() !== keyword.toLowerCase()));
  };

  const handleClearSaved = () => {
    if (window.confirm('Are you sure you want to clear your saved keywords basket?')) {
      setSavedKeywords([]);
    }
  };

  // Cross-view shortcuts
  const handleGenerateContentFor = (kw: string) => {
    setContentKeyword(kw);
    setView('content');
  };

  const handleAnalyzeCompetitorFor = async (kw: string) => {
    setQuery(kw);
    setView('competitor');
    await runAnalysis('competitor', kw);
  };

  const handleAnalyzeInExplorer = async (kw: string) => {
    setQuery(kw);
    setView('dashboard');
    await runAnalysis('dashboard', kw);
  };

  // Core Search & Execution
  const runAnalysis = async (targetView: ViewMode, searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      if (targetView === 'dashboard') {
        const result = await analyzeKeyword(searchQuery);
        setData(result);
      } else if (targetView === 'local') {
        const result = await analyzeLocalKeywords(
          searchQuery,
          coords?.lat,
          coords?.lng,
          locationInput.trim() || undefined
        );
        setLocalData(result);
      } else if (targetView === 'competitor') {
        const result = await analyzeCompetitorGap(searchQuery, []);
        setCompetitorData(result);
      } else if (targetView === 'backlinks') {
        const result = await suggestBacklinks(searchQuery);
        setBacklinkData(result);
      } else if (targetView === 'strategy') {
        const kws = data?.suggestions.map((s) => s.keyword) || [searchQuery];
        const res = await generateContentStrategy(kws, searchQuery);
        setStrategy(res);
      } else if (targetView === 'content') {
        setContentKeyword(searchQuery);
      }
    } catch (err: any) {
      console.error('Error fetching analysis:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    runAnalysis(view, query);
  };

  // Backlink distribution chart data
  const backlinkDistribution = useMemo(() => {
    if (!backlinkData) return [];
    const counts: Record<string, number> = {};
    backlinkData.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [backlinkData]);

  // Dynamic placeholders
  const getPlaceholder = () => {
    switch (view) {
      case 'dashboard':
        return 'Seed keyword, brand, or query (e.g. cloud security)...';
      case 'competitor':
        return 'Target keyword to analyze SERP competitors...';
      case 'local':
        return 'Local service or business query (e.g. dental clinic)...';
      case 'backlinks':
        return 'Niche or industry to find high-authority link targets...';
      case 'strategy':
        return 'Topic theme to generate Hub & Spoke cluster...';
      case 'content':
        return 'Target keyword for E-E-A-T article...';
      default:
        return 'Enter search query...';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar currentView={view} setView={setView} savedCount={savedKeywords.length} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Header Bar */}
        <header className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {view === 'dashboard' && 'Global Keyword Intelligence'}
                  {view === 'competitor' && 'Competitor SERP Gap Analysis'}
                  {view === 'local' && 'Local SEO & Google Maps 3-Pack'}
                  {view === 'backlinks' && 'Link Building & Digital PR'}
                  {view === 'content' && 'E-E-A-T Content Generator'}
                  {view === 'strategy' && 'Topic Cluster & Pillar Strategy'}
                  {view === 'saved' && 'Saved Keyword Basket'}
                  {view === 'roi' && 'Organic ROI & Traffic Modeling'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {view === 'dashboard' && 'Keyword Intel & SERP Analytics'}
                {view === 'competitor' && 'Competitor Content Gap'}
                {view === 'local' && 'Local SEO & Maps Insights'}
                {view === 'backlinks' && 'High-Authority Link Building'}
                {view === 'content' && 'E-E-A-T Article Studio'}
                {view === 'strategy' && 'Content Strategy & Topic Clusters'}
                {view === 'saved' && 'Curated Keyword Basket'}
                {view === 'roi' && 'Traffic & Revenue Simulator'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Advanced SEO intelligence powered by Gemini 3.0 &amp; Google Search/Maps grounding.
              </p>
            </div>

            {/* Global Search Input (visible on analysis views) */}
            {view !== 'saved' && view !== 'roi' && view !== 'content' && (
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:max-w-lg">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-xs sm:text-sm transition-all"
                  />
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {view === 'local' && (
                  <div className="relative sm:w-44">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="City or State (opt)..."
                      className="w-full pl-8 pr-3 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-xs transition-all"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Analyze</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick-seed suggestions toolbar */}
          {view !== 'saved' && view !== 'roi' && view !== 'content' && !loading && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                Quick Start:
              </span>
              {QUICK_SEEDS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s.keyword);
                    runAnalysis(view, s.keyword);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-lg border border-slate-200/80 whitespace-nowrap text-[11px] font-medium transition-colors shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="max-w-6xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-bold block">Analysis Failed:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Main Workspaces */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Loading Indicator */}
          {loading && (
            <div className="bg-white p-16 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Executing Deep SEO Intelligence Query...</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                  Grounding with live Google Search &amp; Maps indices, parsing difficulty trends, and synthesizing strategic advice.
                </p>
              </div>
            </div>
          )}

          {/* VIEW: Global Explorer */}
          {!loading && view === 'dashboard' && data && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Executive Market Opportunity Summary</h3>
                  <button
                    onClick={() => handleGenerateContentFor(data.seed)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Write Article for Seed</span>
                    <span>→</span>
                  </button>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">{data.summary}</p>

                {data.sources && data.sources.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Verified Google Search SERP Sources
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {data.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 border border-slate-200/80 transition-colors flex items-center gap-1.5"
                        >
                          <span>🔗</span>
                          <span>{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <KeywordMetrics
                keywords={data.suggestions}
                overview={data.overview}
                questions={data.questions}
                longTail={data.longTail}
                onSaveKeyword={handleToggleSave}
                isSaved={isKeywordSaved}
                onGenerateContentForKeyword={handleGenerateContentFor}
                onAnalyzeCompetitorForKeyword={handleAnalyzeCompetitorFor}
              />
            </div>
          )}

          {/* VIEW: Competitor Gap */}
          {!loading && view === 'competitor' && competitorData && (
            <CompetitorView
              data={competitorData}
              targetKeyword={query || 'Current Query'}
              onTargetKeyword={handleAnalyzeInExplorer}
              onGenerateContent={handleGenerateContentFor}
            />
          )}

          {/* VIEW: Local SEO */}
          {!loading && view === 'local' && localData && (
            <LocalSEOView
              data={localData}
              onSaveKeyword={handleToggleSave}
              isSaved={isKeywordSaved}
              onGenerateContent={handleGenerateContentFor}
            />
          )}

          {/* VIEW: Backlinks */}
          {!loading && view === 'backlinks' && backlinkData && (
            <div className="space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Link Acquisition Pipeline
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    High-Authority Backlink Targets &amp; Pitch Templates
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Vetted referral sources categorized by Guest Post, Curated Directory, and Resource Page equity.
                  </p>
                </div>

                <div className="h-48 w-full md:w-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={backlinkDistribution}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {backlinkDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {backlinkData.map((opp, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-bold text-slate-900">{opp.siteName}</h4>
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {opp.category}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 mb-2">
                        ★ {opp.relevanceScore}% Relevance Match
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                        {opp.potentialReason}
                      </p>

                      {opp.pitchTemplate && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                            <span>Tailored Outreach Pitch:</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(opp.pitchTemplate!);
                                setCopiedPitchIdx(idx);
                                setTimeout(() => setCopiedPitchIdx(null), 2000);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                              {copiedPitchIdx === idx ? 'Copied!' : 'Copy Pitch'}
                            </button>
                          </div>
                          <p className="italic text-[11px] text-slate-600">{opp.pitchTemplate}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (opp.pitchTemplate) {
                            navigator.clipboard.writeText(opp.pitchTemplate);
                            setCopiedPitchIdx(idx);
                            setTimeout(() => setCopiedPitchIdx(null), 2000);
                          }
                        }}
                        className="text-indigo-600 text-xs font-bold hover:underline"
                      >
                        Copy Outreach Template →
                      </button>
                      {opp.ctaLink && (
                        <a
                          href={opp.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-medium transition-colors"
                        >
                          Submit Listing
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: E-E-A-T Content Generator */}
          {view === 'content' && (
            <ContentGenerator
              initialKeyword={contentKeyword || query}
              onNavigateToExplorer={handleAnalyzeInExplorer}
            />
          )}

          {/* VIEW: Strategy AI */}
          {!loading && view === 'strategy' && strategy && (
            <StrategyView
              strategy={strategy}
              topic={query || 'Current Cluster'}
              onSelectKeyword={handleAnalyzeInExplorer}
              onGenerateContent={handleGenerateContentFor}
            />
          )}

          {/* VIEW: Saved Basket */}
          {view === 'saved' && (
            <SavedKeywordsView
              savedKeywords={savedKeywords}
              onRemoveKeyword={handleRemoveSaved}
              onClearAll={handleClearSaved}
              onGenerateContent={handleGenerateContentFor}
              onAnalyzeKeyword={handleAnalyzeInExplorer}
            />
          )}

          {/* VIEW: ROI Simulator */}
          {view === 'roi' && (
            <RoiCalculator
              initialKeyword={query || 'enterprise cloud platform'}
              initialVolume={data?.overview?.volume ? Math.round(data.overview.volume * 1000) : 15000}
              initialCpc={data?.overview?.cpc || 3.5}
            />
          )}

          {/* Empty / Welcome State */}
          {!loading &&
            !data &&
            !localData &&
            !competitorData &&
            !backlinkData &&
            !strategy &&
            view !== 'content' &&
            view !== 'saved' &&
            view !== 'roi' && (
              <div className="bg-white p-12 sm:p-20 rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-50 to-violet-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto border border-indigo-100 shadow-inner">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Ready to Dominate Google Search?</h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Enter any seed topic above or select a quick-start template to launch instant SERP feature analysis, competitor gap detection, Google Maps 3-pack research, or 1,200+ word E-E-A-T article generation.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {QUICK_SEEDS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(s.keyword);
                        runAnalysis(view, s.keyword);
                      }}
                      className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-xs"
                    >
                      🚀 Test &ldquo;{s.label}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
