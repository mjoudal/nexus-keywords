import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: Boolean(apiKey) });
});

// Helper: Safely parse JSON from model responses (handling markdown backticks)
function cleanAndParseJSON<T>(text: string, fallback: T): T {
  try {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```[a-zA-Z]*\n/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn('Failed to parse JSON directly:', err);
    // Try finding the first JSON array or object
    const startIdxObj = text.indexOf('{');
    const endIdxObj = text.lastIndexOf('}');
    if (startIdxObj !== -1 && endIdxObj !== -1 && endIdxObj > startIdxObj) {
      try {
        return JSON.parse(text.slice(startIdxObj, endIdxObj + 1)) as T;
      } catch {}
    }
    const startIdxArr = text.indexOf('[');
    const endIdxArr = text.lastIndexOf(']');
    if (startIdxArr !== -1 && endIdxArr !== -1 && endIdxArr > startIdxArr) {
      try {
        return JSON.parse(text.slice(startIdxArr, endIdxArr + 1)) as T;
      } catch {}
    }
    return fallback;
  }
}

// 1. Keyword Deep Analysis
app.post('/api/keywords/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite Search Engine Optimization (SEO) director and data scientist.
Conduct an exhaustive keyword research intelligence report for the target query: "${query}".

Requirements:
1. Provide a comprehensive high-level market summary of search demand, competitive landscape, and user intent.
2. Provide a seed overview with estimated search volume, keyword difficulty score (0-100), difficulty label (Easy: 0-29, Moderate: 30-59, Challenging: 60-79, Hard: 80-100), estimated CPC in USD, competition index (0.0 to 1.0), organic CTR potential (%), primary intent, intent confidence (0-100), and intent distribution percentages.
3. Provide 15 to 20 granular keyword suggestions with diverse categories:
   - "Seed Variation"
   - "Long-Tail" (high intent, realistic KD)
   - "Question" (People Also Ask formulations)
   - "Commercial Modifiers" (e.g. best, vs, cost, review, alternative)
For each suggestion, provide:
   - keyword
   - volume (estimated monthly searches in thousands e.g. 14.5)
   - difficulty (0-100)
   - difficultyTrend: array of 6 numbers showing difficulty progression
   - cpc: cost per click estimate in USD
   - intent: Informational, Commercial, Transactional, Navigational, Comparison, Educational, or Local
   - intentConfidence: 0-100
   - serpFeatures: array of detected SERP features ('Featured Snippet', 'People Also Ask', 'Image Pack', 'Video Carousel', 'Knowledge Panel', 'Local Pack', 'Top Stories', 'Site Links', 'Shopping Ads') with 'advice' (crisp tactical summary) and 'details' (in-depth structural requirements to win the feature)
   - trend: array of 6 numbers showing 6-month search interest index (e.g. 45, 60, 75, 80, 85, 95)
   - category
4. Provide 4-6 specific "People Also Ask" questions and 4-6 high-converting Long-Tail keywords.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            overview: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.NUMBER },
                difficulty: { type: Type.NUMBER },
                difficultyLabel: { type: Type.STRING },
                cpc: { type: Type.NUMBER },
                competitionIndex: { type: Type.NUMBER },
                organicCtr: { type: Type.NUMBER },
                primaryIntent: { type: Type.STRING },
                intentConfidence: { type: Type.NUMBER },
                intentDistribution: {
                  type: Type.OBJECT,
                  properties: {
                    informational: { type: Type.NUMBER },
                    commercial: { type: Type.NUMBER },
                    transactional: { type: Type.NUMBER },
                    navigational: { type: Type.NUMBER }
                  },
                  required: ['informational', 'commercial', 'transactional', 'navigational']
                }
              },
              required: ['keyword', 'volume', 'difficulty', 'difficultyLabel', 'cpc', 'primaryIntent', 'intentConfidence']
            },
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
                      required: ['type', 'advice', 'details']
                    }
                  },
                  trend: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                  category: { type: Type.STRING }
                },
                required: ['keyword', 'volume', 'difficulty', 'intent', 'intentConfidence', 'serpFeatures', 'trend']
              }
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  volume: { type: Type.NUMBER },
                  difficulty: { type: Type.NUMBER },
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
                      required: ['type', 'advice', 'details']
                    }
                  },
                  trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                },
                required: ['keyword', 'volume', 'difficulty', 'intent']
              }
            },
            longTail: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  volume: { type: Type.NUMBER },
                  difficulty: { type: Type.NUMBER },
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
                      required: ['type', 'advice', 'details']
                    }
                  },
                  trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                },
                required: ['keyword', 'volume', 'difficulty', 'intent']
              }
            }
          },
          required: ['summary', 'suggestions']
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || '{}', {
      summary: 'Keyword analysis complete.',
      suggestions: []
    });

    const sources =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((c) => c.web)
        .map((c) => ({ title: c.web!.title || 'Web Result', uri: c.web!.uri || '' })) || [];

    res.json({
      seed: query,
      ...parsed,
      sources,
    });
  } catch (error: any) {
    console.error('Error in /api/keywords/analyze:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze keyword' });
  }
});

// 2. Competitor Content Gap Analysis
app.post('/api/keywords/competitor-gap', async (req, res) => {
  try {
    const { keyword, competitorUrls = [] } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const competitorContext = Array.isArray(competitorUrls) && competitorUrls.length > 0
      ? `Specific competitors to analyze: ${competitorUrls.join(', ')}.`
      : `Research the real top ranking organic competitors currently ranking on Google for this keyword.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform an in-depth Competitor Content Gap & SERP Comparison for the target query: "${keyword}".
${competitorContext}

Analyze 4-6 distinct ranking competitors. For each competitor provide:
1. domain: the clean root domain or brand name (e.g. nerdwallet.com or shopify.com)
2. rank: typical organic SERP ranking position (1, 2, 3...)
3. authorityScore: estimated Domain Authority / Search Visibility score (0-100)
4. contentFormat: the winning format (e.g., "Definitive 3,500-Word Guide", "Interactive Calculator & Matrix", "Product Comparison Hub", "Checklist & Free Template")
5. contentStrategy: detailed breakdown of why their page ranks, their content structure, tone, word count, and user engagement mechanics
6. contentGapKeywords: an array of 4-6 high-value keywords and subtopics that this competitor ranks for or addresses, which create huge organic traffic gaps for a new publisher
7. howToBeat: clear tactical blueprint explaining how to outrank this specific competitor (e.g., fresher data, original benchmarks, superior schema markup, better visual assets)`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              rank: { type: Type.NUMBER },
              authorityScore: { type: Type.NUMBER },
              contentFormat: { type: Type.STRING },
              contentStrategy: { type: Type.STRING },
              contentGapKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              howToBeat: { type: Type.STRING }
            },
            required: ['domain', 'rank', 'contentStrategy', 'contentGapKeywords', 'howToBeat']
          }
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || '[]', []);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/keywords/competitor-gap:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze competitor gap' });
  }
});

// 3. Local SEO & Maps Grounding
app.post('/api/keywords/local-seo', async (req, res) => {
  try {
    const { query, lat, lng, locationName } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let mapsSources: { title: string; uri: string }[] = [];
    let mapsSummary = '';

    // Step 1: Query Google Maps grounding without schema/mimeType restrictions
    try {
      const mapsConfig: any = {
        tools: [{ googleMaps: {} }],
      };

      if (lat && lng) {
        mapsConfig.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(lat),
              longitude: Number(lng),
            },
          },
        };
      }

      const locationPrompt = locationName ? ` in or near ${locationName}` : '';
      const mapsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Find top local businesses, service providers, and local SEO competitive landscape for "${query}"${locationPrompt}. Detail their business names, customer ratings, physical addresses, review volume, and local search footprint.`,
        config: mapsConfig,
      });

      mapsSummary = mapsResponse.text || '';
      const groundingChunks = mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      mapsSources = groundingChunks
        .filter((c: any) => c.maps)
        .map((c: any) => ({
          title: c.maps?.title || 'Google Maps Location',
          uri: c.maps?.uri || '',
        }));
    } catch (mapsErr) {
      console.warn('Google Maps grounding call notice:', mapsErr);
    }

    // Step 2: Generate structured Local SEO opportunities using Gemini 3.8 Flash
    const structPrompt = `You are a Local SEO specialist.
Based on the local search query "${query}"${locationName ? ` in "${locationName}"` : ''} and the following verified local data:
"""
${mapsSummary.slice(0, 3000)}
"""

Produce an actionable Local SEO intelligence report formatted as JSON:
1. seed: "${query}"
2. location: detected or targeted city/region (e.g. "${locationName || 'Local Region'}")
3. summary: executive summary of local 3-pack competition, customer search behavior, and review velocity
4. suggestions: 8-12 local keyword phrases with volume (in thousands), difficulty (0-100), difficultyTrend (6 items), cpc, intent (Local / Commercial), intentConfidence (0-100), serpFeatures (with advice and details), trend (6 items)
5. competitors: 3-6 local competitors identified from the market with name, rating (1.0-5.0), reviewsCount, address, and category
6. gbpOptimizationTips: 4-6 specific tips for dominating the Google Business Profile 3-pack for this query
7. citationOpportunities: 4-6 authoritative local business directories and citation hubs`;

    const structuredResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: structPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            location: { type: Type.STRING },
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
                      required: ['type', 'advice', 'details']
                    }
                  },
                  trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                },
                required: ['keyword', 'volume', 'difficulty', 'intent', 'intentConfidence']
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviewsCount: { type: Type.NUMBER },
                  address: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ['name', 'rating', 'address']
              }
            },
            gbpOptimizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            citationOpportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'location', 'suggestions', 'competitors']
        }
      }
    });

    const parsed = cleanAndParseJSON(structuredResponse.text || '{}', {
      summary: mapsSummary || 'Local analysis complete.',
      location: locationName || 'Local',
      suggestions: [],
      competitors: [],
      gbpOptimizationTips: [],
      citationOpportunities: []
    });

    res.json({
      seed: query,
      ...parsed,
      sources: mapsSources,
    });
  } catch (error: any) {
    console.error('Error in /api/keywords/local-seo:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze local keywords' });
  }
});

// 4. Link Building & Outreach Intelligence
app.post('/api/keywords/backlinks', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Find real high-authority link building targets and outreach opportunities for websites in the niche: "${topic}".
Categories must cover:
- 'Local Directory' (high trust regional hubs)
- 'Web Directory' (curated vertical aggregators)
- 'Guest Post' (blogs accepting quality editorial contributions)
- 'Resource Page' (curated links & tools lists)
- 'Industry Publication' (thought leadership & digital PR)

For each of the 6-10 opportunities provide:
- siteName: clean name/domain
- potentialReason: why this backlink has high SEO authority and organic link equity
- relevanceScore: 0 to 100 percentage match to topic
- category: one of the 5 categories above
- ctaLink: direct URL or landing path where possible (e.g. submit page, write for us, or root)
- pitchTemplate: ready-to-use personalized email pitch text customized to this niche`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              siteName: { type: Type.STRING },
              potentialReason: { type: Type.STRING },
              relevanceScore: { type: Type.NUMBER },
              category: { type: Type.STRING },
              ctaLink: { type: Type.STRING },
              pitchTemplate: { type: Type.STRING }
            },
            required: ['siteName', 'potentialReason', 'relevanceScore', 'category']
          }
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || '[]', []);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/keywords/backlinks:', error);
    res.status(500).json({ error: error.message || 'Failed to suggest backlinks' });
  }
});

// 5. Long-Form E-E-A-T Content Generator
app.post('/api/keywords/content-gen', async (req, res) => {
  try {
    const { keyword, secondaryKeywords = [], tone = 'Authoritative & Engaging', targetAudience = 'Decision Makers & Practitioners' } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Target keyword is required' });
    }

    const secondaryStr = Array.isArray(secondaryKeywords) && secondaryKeywords.length > 0
      ? `Naturally integrate these secondary keywords: ${secondaryKeywords.join(', ')}.`
      : '';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an industry-leading content strategist and senior technical editor.
Write an exceptional, comprehensive, publication-grade article optimized to rank #1 on Google for the target keyword: "${keyword}".
${secondaryStr}
Tone: ${tone}.
Target Audience: ${targetAudience}.

Rigorous E-E-A-T Guidelines:
- Experience & Expertise: Include concrete real-world examples, benchmark data, practical scenarios, and step-by-step methodology.
- Authoritativeness: Cite recognized industry best practices, standards, and strategic frameworks.
- Trustworthiness: Balanced pros/cons, nuance, no generic fluff, clear actionable takeaways.
- Structure for Featured Snippets: In the first 150 words, provide a concise direct definition/answer targeting the Google Featured Snippet.
- Organization:
  # Compelling H1 Title (high click-through potential, under 65 chars)
  **Meta Description:** (150-160 chars with primary keyword)
  **Table of Contents:** Quick jump navigation
  ## Introduction & Core Premise (with Featured Snippet block)
  ## Deep-Dive Core Strategy & Fundamentals (with bullet points & callout takeaways)
  ## Actionable Framework / Step-by-Step Implementation Guide
  ## Common Pitfalls & How to Avoid Them
  ## Advanced Strategies & Future Outlook
  ## People Also Ask (FAQ section answering 4-5 real search queries with clear, direct 2-3 sentence answers)
  ## Conclusion & Strategic Next Steps
  ## Recommended Schema.org JSON-LD (render a clean Article and FAQPage JSON-LD snippet at the end in a code block)

Length: At least 1,200 words. Format with rich Markdown, tables where helpful, bold key terms, and blockquotes for expert tips.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    res.json({ content: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/keywords/content-gen:', error);
    res.status(500).json({ error: error.message || 'Failed to generate SEO content' });
  }
});

// 6. Content Strategy & Topic Clustering Matrix
app.post('/api/keywords/strategy', async (req, res) => {
  try {
    const { keywords = [], topic = '' } = req.body;
    const kwList = Array.isArray(keywords) && keywords.length > 0 ? keywords : [topic || 'Digital Growth'];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a Principal SEO Architect.
Build a comprehensive Topic Cluster & Content Hub Strategy (Hub & Spoke architecture) for the seed keyword group: ${kwList.join(', ')}.

Requirements:
1. Define the Central Pillar Page: title, primary target keyword, clean recommended URL slug, and strategic overview.
2. Develop 5 to 7 Supporting Cluster Topics (spokes):
   - title: high-converting article title
   - targetKeyword: specific keyword variation
   - intent: Informational, Commercial, Transactional, Comparison
   - estimatedVolume: estimated monthly search volume in thousands
   - difficulty: 0-100 score
   - priority: 'High', 'Medium', or 'Low'
   - internalLinkRole: exact instruction on how this spoke links to the Pillar and sister clusters (e.g., "Links to Pillar via anchor text [X]; links to Cluster 2 for tactical steps")
   - timeline: e.g. "Week 1", "Week 2", "Month 1"
3. Provide a 3-Phase Publishing Roadmap with estimated duration and milestones.
4. Provide a Conversion Strategy explaining how this cluster converts organic visitors into leads or customers.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pillarTitle: { type: Type.STRING },
            targetKeyword: { type: Type.STRING },
            recommendedSlug: { type: Type.STRING },
            overview: { type: Type.STRING },
            clusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetKeyword: { type: Type.STRING },
                  intent: { type: Type.STRING },
                  estimatedVolume: { type: Type.NUMBER },
                  difficulty: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  internalLinkRole: { type: Type.STRING },
                  timeline: { type: Type.STRING }
                },
                required: ['title', 'targetKeyword', 'intent', 'estimatedVolume', 'difficulty', 'priority', 'internalLinkRole']
              }
            },
            publishingRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['phase', 'duration', 'items']
              }
            },
            conversionStrategy: { type: Type.STRING }
          },
          required: ['pillarTitle', 'targetKeyword', 'recommendedSlug', 'overview', 'clusters', 'publishingRoadmap', 'conversionStrategy']
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || '{}', {
      pillarTitle: topic || 'SEO Content Pillar',
      targetKeyword: topic,
      recommendedSlug: '/pillar-guide',
      overview: 'Topic cluster strategy.',
      clusters: [],
      publishingRoadmap: [],
      conversionStrategy: ''
    });

    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/keywords/strategy:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content strategy' });
  }
});

// Vite Middleware for Dev / Static Files for Production
async function setupApp() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KeywordNexus server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
