export enum Intent {
  INFORMATIONAL = 'Informational',
  NAVIGATIONAL = 'Navigational',
  COMMERCIAL = 'Commercial',
  TRANSACTIONAL = 'Transactional',
  COMPARISON = 'Comparison',
  EDUCATIONAL = 'Educational',
  LOCAL = 'Local'
}

export type SERPFeature =
  | 'Featured Snippet'
  | 'People Also Ask'
  | 'Image Pack'
  | 'Video Carousel'
  | 'Knowledge Panel'
  | 'Local Pack'
  | 'Top Stories'
  | 'Site Links'
  | 'Shopping Ads';

export interface SERPFeatureDetail {
  type: SERPFeature;
  advice: string;
  details: string; // Enriched in-depth explanation
}

export interface KeywordMetric {
  keyword: string;
  volume: number; // in thousands (e.g. 12.5) or absolute
  difficulty: number; // 0-100
  difficultyTrend: number[];
  cpc: number;
  intent: Intent | string;
  intentConfidence: number;
  serpFeatures: SERPFeatureDetail[];
  trend: number[];
  category?: 'Seed Variation' | 'Long-Tail' | 'Question' | 'Commercial Modifiers';
}

export interface SeedOverview {
  keyword: string;
  volume: number;
  difficulty: number;
  difficultyLabel: 'Easy' | 'Moderate' | 'Challenging' | 'Hard';
  cpc: number;
  competitionIndex: number; // 0.0 - 1.0
  organicCtr: number; // 0 - 100%
  primaryIntent: Intent | string;
  intentConfidence: number;
  intentDistribution?: {
    informational: number;
    commercial: number;
    transactional: number;
    navigational: number;
  };
}

export interface KeywordAnalysis {
  seed: string;
  overview?: SeedOverview;
  summary: string;
  suggestions: KeywordMetric[];
  questions?: KeywordMetric[];
  longTail?: KeywordMetric[];
  serpSummary?: string;
  sources: { title: string; uri: string }[];
}

export interface CompetitorInsight {
  domain: string;
  rank: number;
  authorityScore?: number; // 0-100
  contentFormat?: string; // e.g. "Comprehensive Guide", "Interactive Tool", "Listicle"
  contentStrategy: string;
  contentGapKeywords: string[];
  howToBeat?: string;
}

export interface BacklinkOpportunity {
  siteName: string;
  potentialReason: string;
  relevanceScore: number;
  category: 'Local Directory' | 'Web Directory' | 'Guest Post' | 'Resource Page' | 'Industry Publication';
  ctaLink?: string; // Direct integration point for local/web directories
  pitchTemplate?: string;
}

export interface LocalCompetitor {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  mapsUrl?: string;
  category?: string;
}

export interface LocalKeywordAnalysis {
  seed: string;
  location: string;
  summary: string;
  suggestions: KeywordMetric[];
  competitors: LocalCompetitor[];
  gbpOptimizationTips?: string[];
  citationOpportunities?: string[];
  sources: { title: string; uri: string }[];
}

export interface ClusterTopic {
  title: string;
  targetKeyword: string;
  intent: string;
  estimatedVolume: number;
  difficulty: number;
  priority: 'High' | 'Medium' | 'Low';
  internalLinkRole: string;
  timeline: string;
}

export interface ContentStrategyMatrix {
  pillarTitle: string;
  targetKeyword: string;
  recommendedSlug: string;
  overview: string;
  clusters: ClusterTopic[];
  publishingRoadmap: { phase: string; duration: string; items: string[] }[];
  conversionStrategy: string;
}

export interface SavedKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  savedAt: string;
}

export type ViewMode =
  | 'dashboard'
  | 'competitor'
  | 'local'
  | 'backlinks'
  | 'strategy'
  | 'content'
  | 'saved'
  | 'roi';
