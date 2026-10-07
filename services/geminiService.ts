
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordAnalysis, LocalKeywordAnalysis, CompetitorInsight, BacklinkOpportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeKeyword = async (query: string): Promise<KeywordAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the keyword/topic: "${query}". Provide a comprehensive keyword research report.
    Include granular intent and confidence.
    For each SERP feature, provide "advice" (brief) AND "details" (in-depth strategic considerations).
    Include estimated search volume trends AND difficulty trends (0-100) over 6 points.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.NUMBER },
                difficulty: { type: Type.NUMBER },
                difficultyTrend: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                cpc: { type: Type.NUMBER },
                intent: { type: Type.STRING },
                intentConfidence: { type: Type.NUMBER },
                serpFeatures: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      advice: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ["type", "advice", "details"]
                  }
                },
                trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
              },
              required: ["keyword", "volume", "difficulty", "difficultyTrend", "intent", "intentConfidence", "serpFeatures"]
            }
          }
        },
        required: ["summary", "suggestions"]
      }
    }
  });

  return {
    seed: query,
    ...JSON.parse(response.text.trim()),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(c => c.web).map(c => ({ title: c.web!.title, uri: c.web!.uri })) || []
  };
};

export const suggestBacklinks = async (topic: string): Promise<BacklinkOpportunity[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find high-authority websites and backlink opportunities for "${topic}". 
    Categorize into: Local Directory, Web Directory, Guest Post, Resource Page.
    For Directories, provide a "ctaLink" if a specific submission page can be identified via search.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            siteName: { type: Type.STRING },
            potentialReason: { type: Type.STRING },
            relevanceScore: { type: Type.NUMBER },
            category: { type: Type.STRING },
            ctaLink: { type: Type.STRING }
          },
          required: ["siteName", "potentialReason", "relevanceScore", "category"]
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateSEOContent = async (keyword: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a high-quality, human-readable, and engaging article about "${keyword}". 
    Requirements:
    - Minimum 1000 words.
    - Follow Google SEO guidelines and E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
    - Use clear headings (H1, H2, H3), bullet points, and short paragraphs for mobile-friendliness.
    - Include an introduction, deep-dive sections, a FAQ based on "People Also Ask", and a conclusion.
    - Be authoritative yet accessible.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

// ... keep existing analyzeCompetitorGap and analyzeLocalKeywords ...
export const analyzeCompetitorGap = async (keyword: string, competitorUrls: string[]): Promise<CompetitorInsight[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a content gap analysis for the keyword "${keyword}". Compare the top ranking sites: ${competitorUrls.join(', ')}. 
    Identify keywords these competitors rank for that I might be missing.
    Analyze their content strategy: content type, tone, and depth.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            rank: { type: Type.NUMBER },
            contentStrategy: { type: Type.STRING },
            contentGapKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["domain", "rank", "contentStrategy", "contentGapKeywords"]
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const analyzeLocalKeywords = async (query: string, lat?: number, lng?: number): Promise<LocalKeywordAnalysis> => {
  const config: any = { tools: [{ googleMaps: {} }, { googleSearch: {} }] };
  if (lat && lng) { config.toolConfig = { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }; }
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Find local SEO keyword opportunities for: "${query}"`, config });
  const structurer = await ai.models.generateContent({
    model: 'gemini-3-flash-lite-latest',
    contents: `Structure this into JSON: ${response.text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          location: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, volume: { type: Type.NUMBER }, difficulty: { type: Type.NUMBER }, intent: { type: Type.STRING } } } },
          competitors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, rating: { type: Type.NUMBER }, address: { type: Type.STRING } } } }
        }
      }
    }
  });
  return { seed: query, ...JSON.parse(structurer.text.trim()), sources: [] };
};

export const generateContentStrategy = async (keywords: string[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a detailed content marketing and SEO strategy for the cluster: ${keywords.join(', ')}.`,
    config: { thinkingConfig: { thinkingBudget: 2000 } }
  });
  return response.text;
};
