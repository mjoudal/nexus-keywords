import React, { useState, useMemo } from 'react';
import { SavedKeyword } from '../types';

interface Props {
  savedKeywords: SavedKeyword[];
  onRemoveKeyword: (kw: string) => void;
  onClearAll: () => void;
  onGenerateContent: (kw: string) => void;
  onAnalyzeKeyword: (kw: string) => void;
}

const SavedKeywordsView: React.FC<Props> = ({
  savedKeywords,
  onRemoveKeyword,
  onClearAll,
  onGenerateContent,
  onAnalyzeKeyword,
}) => {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return savedKeywords.filter((k) =>
      k.keyword.toLowerCase().includes(filter.toLowerCase())
    );
  }, [savedKeywords, filter]);

  const totalVolume = useMemo(() => {
    return savedKeywords.reduce((acc, k) => acc + Math.round((k.volume || 1) * 1000), 0);
  }, [savedKeywords]);

  const avgDifficulty = useMemo(() => {
    if (savedKeywords.length === 0) return 0;
    return Math.round(
      savedKeywords.reduce((acc, k) => acc + (k.difficulty || 0), 0) / savedKeywords.length
    );
  }, [savedKeywords]);

  const handleExportCSV = () => {
    if (savedKeywords.length === 0) return;
    const header = ['Keyword', 'Monthly Volume', 'Difficulty (0-100)', 'Est CPC ($)', 'Intent', 'Date Saved'];
    const rows = savedKeywords.map((k) => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      Math.round(k.volume * 1000),
      k.difficulty,
      k.cpc,
      `"${k.intent}"`,
      k.savedAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `saved-keywords-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyClipboard = () => {
    if (savedKeywords.length === 0) return;
    const text = savedKeywords
      .map((k) => `${k.keyword}\t${Math.round(k.volume * 1000)}\t${k.difficulty}\t$${k.cpc}\t${k.intent}`)
      .join('\n');
    navigator.clipboard.writeText(`Keyword\tVolume\tKD\tCPC\tIntent\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
            Keyword Tracker Basket
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Saved Keywords ({savedKeywords.length})</h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate and export targeted keyword portfolios across your global, local, and competitor research sessions.
          </p>
        </div>

        {savedKeywords.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyClipboard}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>{copied ? 'Copied!' : 'Copy TSV'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
            >
              Clear Basket
            </button>
          </div>
        )}
      </div>

      {/* Aggregate Stats */}
      {savedKeywords.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Saved Keywords</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{savedKeywords.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">High-intent keyword opportunities</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Combined Monthly Volume</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">{totalVolume.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-0.5">Monthly organic search demand</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Keyword Difficulty</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{avgDifficulty} / 100</div>
            <div className="text-xs text-slate-500 mt-0.5">Weighted competitive index</div>
          </div>
        </div>
      )}

      {/* List or Empty State */}
      {savedKeywords.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Keyword Basket is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon next to any keyword in Global Explorer or Local SEO to curate your target keyword list.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search saved keywords..."
              className="px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 w-64"
            />
            <span className="text-xs text-slate-400">
              Showing {filtered.length} of {savedKeywords.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Keyword</th>
                  <th className="px-6 py-3.5 text-right">Volume</th>
                  <th className="px-6 py-3.5">Difficulty</th>
                  <th className="px-6 py-3.5">CPC</th>
                  <th className="px-6 py-3.5">Intent</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((kw) => (
                  <tr key={kw.keyword} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{kw.keyword}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      {Math.round(kw.volume * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{kw.difficulty}</span>
                      <span className="text-[10px] text-slate-400 ml-1">/ 100</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">${Number(kw.cpc || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-indigo-50 text-indigo-700">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onGenerateContent(kw.keyword)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition-colors text-[11px]"
                          title="Generate E-E-A-T article"
                        >
                          Write Article
                        </button>
                        <button
                          onClick={() => onAnalyzeKeyword(kw.keyword)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-[11px]"
                          title="Analyze in Explorer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => onRemoveKeyword(kw.keyword)}
                          className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Remove from basket"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedKeywordsView;
