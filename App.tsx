
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import KeywordMetrics from './components/KeywordMetrics';
import { ViewMode, KeywordAnalysis, LocalKeywordAnalysis, CompetitorInsight, BacklinkOpportunity } from './types';
import { analyzeKeyword, analyzeLocalKeywords, generateContentStrategy, analyzeCompetitorGap, suggestBacklinks, generateSEOContent } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KeywordAnalysis | null>(null);
  const [localData, setLocalData] = useState<LocalKeywordAnalysis | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorInsight[] | null>(null);
  const [backlinkData, setBacklinkData] = useState<BacklinkOpportunity[] | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [seoContent, setSeoContent] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      if (view === 'dashboard') {
        const result = await analyzeKeyword(query);
        setData(result);
      } else if (view === 'local') {
        const result = await analyzeLocalKeywords(query, coords?.lat, coords?.lng);
        setLocalData(result);
      } else if (view === 'competitor') {
        const result = await analyzeCompetitorGap(query, []);
        setCompetitorData(result);
      } else if (view === 'backlinks') {
        const result = await suggestBacklinks(query);
        setBacklinkData(result);
      } else if (view === 'strategy') {
        let kws = data?.suggestions.map(s => s.keyword) || [query];
        const res = await generateContentStrategy(kws);
        setStrategy(res);
      } else if (view === 'content') {
        const res = await generateSEOContent(query);
        setSeoContent(res);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching analysis. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const backlinkDistribution = useMemo(() => {
    if (!backlinkData) return [];
    const counts: Record<string, number> = {};
    backlinkData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [backlinkData]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="max-w-6xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {view === 'dashboard' && 'Keyword Intel & SERP'}
                {view === 'competitor' && 'Competitor Content Gap'}
                {view === 'local' && 'Local SEO Insights'}
                {view === 'backlinks' && 'Link Building Opportunities'}
                {view === 'content' && 'E-E-A-T Content Generator'}
                {view === 'strategy' && 'Content Strategy AI'}
              </h1>
              <p className="text-slate-500 font-medium">Advanced SEO Intelligence powered by Gemini 3.0</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative group w-full max-w-md">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={view === 'content' ? "Target keyword for article..." : "Topic, keyword, or URL..."}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
              >
                {loading ? '...' : view === 'content' ? 'Write' : 'Analyze'}
              </button>
            </form>
          </div>
        </header>

        <div className="max-w-6xl mx-auto space-y-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Running deep SEO analysis...</p>
            </div>
          )}

          {!loading && view === 'dashboard' && data && (
            <>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Market Opportunity Summary</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{data.summary}</p>
                <div className="flex flex-wrap gap-2">
                   {data.sources.map((s, idx) => (
                     <a key={idx} href={s.uri} target="_blank" className="text-xs bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 hover:text-indigo-600 border border-slate-200">
                        🔗 {s.title}
                     </a>
                   ))}
                </div>
              </div>
              <KeywordMetrics keywords={data.suggestions} />
            </>
          )}

          {!loading && view === 'backlinks' && backlinkData && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Opportunity Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={backlinkDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {backlinkDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {backlinkData.map((opp, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{opp.siteName}</h3>
                        <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                          {opp.category}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 mb-2">{opp.relevanceScore}% Match</div>
                      <p className="text-slate-600 text-sm mb-4">{opp.potentialReason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-600 text-sm font-bold hover:underline">Outreach Setup →</button>
                      {opp.ctaLink && (
                        <a href={opp.ctaLink} target="_blank" className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md hover:bg-slate-800">
                          Submit Listing
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && view === 'content' && seoContent && (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h2 className="text-xl font-bold">Generated SEO Article</h2>
                </div>
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">Print / Save PDF</button>
              </div>
              <div className="prose prose-indigo prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 whitespace-pre-wrap">
                {seoContent}
              </div>
            </div>
          )}

          {/* Fallback to original content for other views */}
          {!loading && view === 'competitor' && competitorData && (
            <div className="space-y-6">
              {competitorData.map((comp, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">Rank #{comp.rank}</div>
                    <h3 className="text-lg font-bold text-indigo-600">{comp.domain}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Content Strategy</h4>
                      <p className="text-slate-600 text-sm">{comp.contentStrategy}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Keyword Gaps</h4>
                      <div className="flex flex-wrap gap-2">
                        {comp.contentGapKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-xs font-medium">+{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !data && !localData && !strategy && !competitorData && !backlinkData && !seoContent && (
             <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Dominate Search?</h2>
              <p className="text-slate-500 max-w-sm">Select a tool from the sidebar and enter your target keyword to generate AI-powered SEO blueprints or 1000+ word articles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
