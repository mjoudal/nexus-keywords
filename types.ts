
export enum Intent {
  INFORMATIONAL = 'Informational',
  NAVIGATIONAL = 'Navigational',
  COMMERCIAL = 'Commercial',
  TRANSACTIONAL = 'Transactional',
  COMPARISON = 'Comparison',
  EDUCATIONAL = 'Educational',
  LOCAL = 'Local'
}

export type SERPFeature = 'Featured Snippet' | 'People Also Ask' | 'Image Pack' | 'Video Carousel' | 'Knowledge Panel' | 'Local Pack' | 'Top Stories';

export interface SERPFeatureDetail {
  type: SERPFeature;
  advice: string;
  details: string; // Enriched in-depth explanation
}

export interface KeywordMetric {
  keyword: string;
  volume: number;
  difficulty: number;
  difficultyTrend: number[];
  cpc: number;
  intent: Intent;
  intentConfidence: number;
  serpFeatures: SERPFeatureDetail[];
  trend: number[];
}

export interface KeywordAnalysis {
  seed: string;
  suggestions: KeywordMetric[];
  summary: string;
  sources: { title: string; uri: string }[];
}

export interface CompetitorInsight {
  domain: string;
  rank: number;
  contentStrategy: string;
  contentGapKeywords: string[];
}

export interface BacklinkOpportunity {
  siteName: string;
  potentialReason: string;
  relevanceScore: number;
  category: 'Local Directory' | 'Web Directory' | 'Guest Post' | 'Resource Page';
  ctaLink?: string; // Direct integration point for local/web directories
}

export interface LocalKeywordAnalysis extends KeywordAnalysis {
  location: string;
  competitors: { name: string; rating: number; address: string }[];
}

export type ViewMode = 'dashboard' | 'local' | 'competitor' | 'strategy' | 'backlinks' | 'content';
