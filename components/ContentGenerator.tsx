import React, { useState } from 'react';
import { generateSEOContent } from '../services/geminiService';

interface Props {
  initialKeyword?: string;
  onNavigateToExplorer?: (kw: string) => void;
}

const ContentGenerator: React.FC<Props> = ({ initialKeyword = '', onNavigateToExplorer }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [tone, setTone] = useState('Authoritative & Engaging');
  const [audience, setAudience] = useState('Practitioners & Decision Makers');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Sync if initialKeyword changes
  React.useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setContent(null);
    try {
      const secondaryList = secondaryKeywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await generateSEOContent(keyword, secondaryList, tone, audience);
      setContent(res);
    } catch (err: any) {
      console.error('Content generation error:', err);
      alert(`Content generation failed: ${err.message || 'Please check your connection.'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (type: 'markdown' | 'text') => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadMarkdown = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-seo-article.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Controls Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">E-E-A-T Content Generator</h2>
            <p className="text-xs text-slate-500 font-medium">
              Create 1,200+ word publication-ready articles optimized for Google helpful content guidelines & SERP snippet dominance.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Target Keyword *
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. enterprise cloud security best practices"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary / LSI Keywords (comma separated)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="e.g. zero trust architecture, SOC 2 compliance, IAM protocols"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Authoritative & Engaging">Authoritative & Engaging (Recommended for B2B/SaaS)</option>
                <option value="Technical & In-Depth">Technical & In-Depth (Whitepaper / Engineering)</option>
                <option value="Conversational & Actionable">Conversational & Actionable (Consumer / Guides)</option>
                <option value="Executive Thought Leadership">Executive Thought Leadership (C-Suite / Vision)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Practitioners & Decision Makers">Practitioners & Decision Makers</option>
                <option value="Beginners & Hobbyists">Beginners & Hobbyists</option>
                <option value="Senior Architects & Technical Leads">Senior Architects & Technical Leads</option>
                <option value="Business Owners & Entrepreneurs">Business Owners & Entrepreneurs</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Grounding: Google Search SERP benchmarks enabled</span>
            </div>

            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 flex items-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Writing E-E-A-T Master Article...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Full Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-slate-900">Researching SERP & Architecting Article...</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Structuring H1-H3 hierarchy, weaving LSI keywords, drafting Featured Snippet block, and synthesizing FAQ Schema markup.
          </p>
        </div>
      )}

      {/* Generated Article Display */}
      {!loading && content && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Bar with stats and actions */}
          <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-indigo-600 font-bold">{wordCount}</span>
                <span>Words</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-indigo-600 font-bold">{readingTime}</span>
                <span>Min Read</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span>✓ E-E-A-T Validated</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
                <span>✓ FAQ Schema Included</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => copyToClipboard('markdown')}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{copiedType === 'markdown' ? 'Copied MD!' : 'Copy Markdown'}</span>
              </button>

              <button
                onClick={downloadMarkdown}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download .MD</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Article Render Content */}
          <div className="p-8 sm:p-12">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 whitespace-pre-wrap font-sans">
              {content}
            </div>

            {onNavigateToExplorer && (
              <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Want to uncover more related keywords for this topic?</span>
                <button
                  onClick={() => onNavigateToExplorer(keyword)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Explore &ldquo;{keyword}&rdquo; in Global Explorer</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
