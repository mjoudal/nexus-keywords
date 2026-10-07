import React from 'react';
import { ContentStrategyMatrix, ClusterTopic } from '../types';

interface Props {
  strategy: ContentStrategyMatrix | string;
  topic: string;
  onSelectKeyword?: (kw: string) => void;
  onGenerateContent?: (kw: string) => void;
}

const StrategyView: React.FC<Props> = ({
  strategy,
  topic,
  onSelectKeyword,
  onGenerateContent,
}) => {
  // Handle both structured matrix and string formats
  if (typeof strategy === 'string') {
    return (
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Topic Cluster Blueprint
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Content Strategy AI: {topic}</h2>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Print / PDF
          </button>
        </div>
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-p:text-slate-600 prose-p:leading-relaxed whitespace-pre-wrap">
          {strategy}
        </div>
      </div>
    );
  }

  const matrix = strategy as ContentStrategyMatrix;

  const getPriorityBadge = (p: string) => {
    switch (p.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Central Pillar Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-indigo-200 border border-white/10">
              Core Hub &amp; Spoke Architecture
            </span>
            <span className="text-xs text-indigo-300">Pillar Slug: {matrix.recommendedSlug}</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            {matrix.pillarTitle}
          </h2>

          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            {matrix.overview}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onGenerateContent && onGenerateContent(matrix.targetKeyword || matrix.pillarTitle)}
              className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Write Central Pillar Page</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {onSelectKeyword && (
              <button
                onClick={() => onSelectKeyword(matrix.targetKeyword)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-sm transition-all"
              >
                Inspect Pillar in Explorer ↗
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Supporting Cluster Topics (Spokes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Supporting Cluster Content (Spokes)
            </h3>
            <p className="text-xs text-slate-500">
              Interlinked content assets designed to establish topical authority and feed link equity to the Pillar.
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">
            {matrix.clusters.length} Cluster Spokes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matrix.clusters.map((cluster: ClusterTopic, idx: number) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(cluster.priority)}`}>
                    {cluster.priority} Priority
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {cluster.timeline || `Phase ${idx + 1}`}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">
                  {cluster.title}
                </h4>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 mb-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Target Keyword:</span>
                    <strong className="text-slate-800">{cluster.targetKeyword}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Est. Volume:</span>
                    <strong className="text-indigo-600">{Math.round((cluster.estimatedVolume || 1) * 1000).toLocaleString()}/mo</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Intent:</span>
                    <span className="text-slate-700 font-medium">{cluster.intent}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60 leading-relaxed mb-4">
                  <strong className="text-indigo-900 block mb-0.5 font-bold">Internal Linking Directives:</strong>
                  {cluster.internalLinkRole}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onGenerateContent && onGenerateContent(cluster.targetKeyword || cluster.title)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Write Article</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {onSelectKeyword && (
                  <button
                    onClick={() => onSelectKeyword(cluster.targetKeyword)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Analyze KD ↗
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publishing Roadmap & Conversion Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matrix.publishingRoadmap && matrix.publishingRoadmap.length > 0 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>Publishing Roadmap & Rollout Schedule</span>
            </h4>
            <div className="space-y-4">
              {matrix.publishingRoadmap.map((phase, pIdx) => (
                <div key={pIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-xs font-bold text-indigo-900">{phase.phase}</strong>
                    <span className="text-[11px] text-slate-400 font-medium">{phase.duration}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.items.map((it, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">✦</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {matrix.conversionStrategy && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Organic Conversion Architecture</span>
            </h4>
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{matrix.conversionStrategy}</p>
              <div className="pt-3 border-t border-emerald-200/50 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                <span>💡 Best Practice:</span>
                <span>Place contextual lead magnets within the top 30% of high-intent cluster articles.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyView;
