import {
  KeywordAnalysis,
  LocalKeywordAnalysis,
  CompetitorInsight,
  BacklinkOpportunity,
  ContentStrategyMatrix
} from '../types';

export const analyzeKeyword = async (query: string): Promise<KeywordAnalysis> => {
  const res = await fetch('/api/keywords/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to analyze keyword' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const suggestBacklinks = async (topic: string): Promise<BacklinkOpportunity[]> => {
  const res = await fetch('/api/keywords/backlinks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to get backlink opportunities' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const generateSEOContent = async (
  keyword: string,
  secondaryKeywords: string[] = [],
  tone: string = 'Authoritative & Engaging',
  targetAudience: string = 'Decision Makers & Practitioners'
): Promise<string> => {
  const res = await fetch('/api/keywords/content-gen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, secondaryKeywords, tone, targetAudience }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to generate SEO content' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  const data = await res.json();
  return data.content || '';
};

export const analyzeCompetitorGap = async (
  keyword: string,
  competitorUrls: string[] = []
): Promise<CompetitorInsight[]> => {
  const res = await fetch('/api/keywords/competitor-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, competitorUrls }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to analyze competitor gap' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const analyzeLocalKeywords = async (
  query: string,
  lat?: number,
  lng?: number,
  locationName?: string
): Promise<LocalKeywordAnalysis> => {
  const res = await fetch('/api/keywords/local-seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, lat, lng, locationName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to analyze local SEO keywords' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const generateContentStrategy = async (
  keywords: string[],
  topic?: string
): Promise<ContentStrategyMatrix> => {
  const res = await fetch('/api/keywords/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, topic }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to generate strategy matrix' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
};
