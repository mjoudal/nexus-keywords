import React from 'react';
import { LocalKeywordAnalysis, KeywordMetric } from '../types';
import KeywordMetrics from './KeywordMetrics';

interface Props {
  data: LocalKeywordAnalysis;
  onSaveKeyword?: (kw: KeywordMetric) => void;
  isSaved?: (kw: string) => boolean;
  onGenerateContent?: (kw: string) => void;
}

const LocalSEOView: React.FC<Props> = ({
  data,
  onSaveKeyword,
  isSaved,
  onGenerateContent,
}) => {
  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-rose-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                Google Maps Grounded
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                Local SEO & 3-Pack Intel: &ldquo;{data.location || data.seed}&rdquo;
              </h2>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {data.summary}
        </p>

        {/* Maps Grounding Links */}
        {data.sources && data.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Verified Google Maps Sources & Place Listings
            </span>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-rose-50/70 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200/60 font-medium transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{s.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Local Competitors 3-Pack Grid */}
      {data.competitors && data.competitors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Local 3-Pack Competitor Footprint</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                {data.competitors.length} Detected
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.competitors.map((comp, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                    {comp.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap">
                        <span>★</span>
                        <span>{comp.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {comp.category && (
                    <div className="text-[11px] text-indigo-600 font-medium mb-2">
                      {comp.category}
                    </div>
                  )}
                  {comp.address && (
                    <div className="text-xs text-slate-500 mb-3 flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-2">{comp.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {comp.reviewsCount ? `${comp.reviewsCount} reviews` : 'Established Local'}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${comp.name} ${comp.address || data.location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Keyword Opportunities Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Local Keyword Phrases & Search Volumes</h3>
        <KeywordMetrics
          keywords={data.suggestions}
          onSaveKeyword={onSaveKeyword}
          isSaved={isSaved}
          onGenerateContentForKeyword={onGenerateContent}
        />
      </div>

      {/* Action Plan: GBP Optimization & Citation Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.gbpOptimizationTips && data.gbpOptimizationTips.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Google Business Profile (GBP) 3-Pack Playbook</span>
            </h4>
            <ul className="space-y-2.5">
              {data.gbpOptimizationTips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.citationOpportunities && data.citationOpportunities.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>High-Impact Local Citation Targets</span>
            </h4>
            <ul className="space-y-2.5">
              {data.citationOpportunities.map((citation, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-2.5">
                  <span className="text-indigo-500 font-bold mt-0.5">✦</span>
                  <span className="leading-relaxed">{citation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSEOView;
