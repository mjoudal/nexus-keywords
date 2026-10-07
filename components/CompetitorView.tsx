import React from 'react';
import { CompetitorInsight } from '../types';

interface Props {
  data: CompetitorInsight[];
  targetKeyword: string;
  onTargetKeyword: (kw: string) => void;
  onGenerateContent: (kw: string) => void;
}

const CompetitorView: React.FC<Props> = ({
  data,
  targetKeyword,
  onTargetKeyword,
  onGenerateContent,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              SERP Competitive Intelligence
            </span>
            <span className="text-xs text-slate-400">Target: &ldquo;{targetKeyword}&rdquo;</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Top Ranking Competitor Gap Analysis</h2>
          <p className="text-xs text-slate-500 mt-1">
            Reverse-engineered organic competitors, their winning content structures, and untapped keyword opportunities you can exploit.
          </p>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-6">
        {data.map((comp, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all">
            <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                  #{comp.rank}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>{comp.domain}</span>
                    <a
                      href={`https://${comp.domain.replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Visit competitor site"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {comp.contentFormat && (
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        Format: {comp.contentFormat}
                      </span>
                    )}
                    {comp.authorityScore !== undefined && (
                      <span className="text-[11px] font-semibold text-slate-600">
                        Authority: <strong className="text-indigo-600">{comp.authorityScore}/100</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onGenerateContent(targetKeyword)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Write Outranking Article</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Strategy Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Content Strategy & Architecture</span>
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {comp.contentStrategy}
                </p>
              </div>

              {/* How to Beat Them Blueprint */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Tactical Blueprint: How to Beat Them</span>
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80">
                  {comp.howToBeat || 'Deliver fresher benchmarks, include an interactive tool or template, and provide deeper step-by-step guidance.'}
                </p>
              </div>
            </div>

            {/* Content Gap Keywords */}
            <div className="px-6 pb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Untapped Keyword Gaps (They Rank For, You May Be Missing)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {comp.contentGapKeywords.map((gapKw, i) => (
                  <div
                    key={i}
                    className="group/tag flex items-center gap-2 bg-rose-50/70 hover:bg-rose-100 text-rose-800 border border-rose-200/80 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  >
                    <span>+{gapKw}</span>
                    <button
                      onClick={() => onTargetKeyword(gapKw)}
                      className="opacity-60 group-hover/tag:opacity-100 text-rose-700 hover:text-indigo-600 transition-colors ml-1 font-bold text-[11px]"
                      title="Analyze in Explorer"
                    >
                      Analyze ↗
                    </button>
                    <button
                      onClick={() => onGenerateContent(gapKw)}
                      className="opacity-60 group-hover/tag:opacity-100 text-rose-700 hover:text-indigo-600 transition-colors font-bold text-[11px]"
                      title="Write Article"
                    >
                      Write ✍
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorView;
