import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK lazily / safely on server side
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

/**
 * 1. Natural Language Intake
 * Extracts financing parameters from French or Arabic text
 */
app.post('/api/gemini/parse-intake', async (req, res) => {
  try {
    const { query, language = 'fr' } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query text is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Deterministic rule-based extraction fallback if Gemini API is unconfigured
      const lower = query.toLowerCase();
      const amountMatch = query.match(/(\d+[\d\s.,]*)\s*(dt|dinar|tnd|k\b|mille)/i);
      let detectedAmount = 0;
      if (amountMatch) {
        const cleaned = amountMatch[1].replace(/[\s,]/g, '');
        detectedAmount = parseFloat(cleaned) || 0;
        if (query.toLowerCase().includes('mille') || query.toLowerCase().includes('k')) {
          if (detectedAmount < 1000) detectedAmount *= 1000;
        }
      }

      let purpose: string = 'creation';
      if (lower.includes('équipement') || lower.includes('machine') || lower.includes('outillage') || lower.includes('معدات') || lower.includes('آلات')) {
        purpose = 'equipment';
      } else if (lower.includes('roulement') || lower.includes('trésorerie') || lower.includes('تسيير') || lower.includes('سيولة')) {
        purpose = 'working_capital';
      } else if (lower.includes('agricole') || lower.includes('فلاحة') || lower.includes('أرض')) {
        purpose = 'agriculture';
      } else if (lower.includes('startup') || lower.includes('innov') || lower.includes('تجديد') || lower.includes('تكنولوج')) {
        purpose = 'innovation_rd';
      }

      let sector: string = 'services';
      if (lower.includes('textile') || lower.includes('usine') || lower.includes('industr') || lower.includes('صناعة')) {
        sector = 'industry';
      } else if (lower.includes('agri') || lower.includes('fella') || lower.includes('فلاح')) {
        sector = 'agriculture_agribusiness';
      } else if (lower.includes('tech') || lower.includes('logiciel') || lower.includes('app') || lower.includes('برمجة')) {
        sector = 'ict_tech';
      } else if (lower.includes('artisan') || lower.includes('نجارة') || lower.includes('خياطة') || lower.includes('حرف')) {
        sector = 'crafts_trades';
      }

      let location = 'Tunis';
      const knownGovs = ['Sousse', 'Sfax', 'Kasserine', 'Sidi Bouzid', 'Gafsa', 'Bizerte', 'Nabeul', 'Monastir', 'Mahdia', 'Kairouan', 'Béja', 'Jendouba', 'Siliana', 'Le Kef', 'Médenine', 'Tataouine', 'Gabès', 'Kébili', 'Tozeur', 'Zaghouan', 'Ariana', 'Ben Arous', 'La Manouba'];
      for (const gov of knownGovs) {
        if (lower.includes(gov.toLowerCase())) {
          location = gov;
          break;
        }
      }

      return res.json({
        success: true,
        source: 'fallback_heuristic',
        extracted: {
          purpose,
          financingRequested: detectedAmount > 0 ? detectedAmount : 50000,
          totalProjectCost: detectedAmount > 0 ? Math.round(detectedAmount * 1.25) : 65000,
          userContribution: detectedAmount > 0 ? Math.round(detectedAmount * 0.25) : 15000,
          sector,
          location,
          businessStage: 'idea_project',
          summary: `Demande identifiée: ${purpose} dans le secteur ${sector} à ${location}.`
        }
      });
    }

    // Call Gemini with schema
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are Mizen's financial intake engine in Tunisia. 
Analyze the user's natural language request describing their financing project in Tunisia.
User input: "${query}"

Extract all verifiable parameters.
Rules:
- financingRequested: numerical amount in Tunisian Dinars (TND / DT). If user writes 80 000 DT, extract 80000. If user says "80k", extract 80000.
- totalProjectCost: if specified, else calculate as financingRequested / 0.8 if sensible, or equal.
- userContribution: if mentioned or calculate totalProjectCost - financingRequested.
- purpose: one of ['creation', 'equipment', 'working_capital', 'expansion', 'agriculture', 'innovation_rd', 'export'].
- sector: one of ['industry', 'services', 'agriculture_agribusiness', 'ict_tech', 'crafts_trades', 'commerce', 'renewable_energy', 'tourism', 'other'].
- location: exact Tunisian governorate if identifiable (e.g. Sousse, Tunis, Sfax, Kasserine, etc.), or null.
- businessStage: one of ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y'].
- missingCriticalFields: array of strings listing what is still needed (e.g. 'apport_personnel', 'diplome', 'forme_juridique').
- summaryText: short friendly confirmation in ${language === 'ar' ? 'Arabic' : 'French'}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            financingRequested: { type: Type.NUMBER },
            totalProjectCost: { type: Type.NUMBER },
            userContribution: { type: Type.NUMBER },
            purpose: { type: Type.STRING },
            sector: { type: Type.STRING },
            location: { type: Type.STRING },
            businessStage: { type: Type.STRING },
            missingCriticalFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summaryText: { type: Type.STRING }
          },
          required: ['financingRequested', 'purpose', 'sector', 'summaryText']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      extracted: parsed
    });
  } catch (error) {
    console.error('Gemini parse error:', error);
    res.status(500).json({ error: 'Failed to parse natural language request', details: String(error) });
  }
});

/**
 * 2. Plain Language Explanation
 * Explains why an option matches and what nuances to negotiate
 */
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const { programName, providerName, reasons, language = 'fr' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'fallback',
        explanation: language === 'ar'
          ? `تم تحديد ${programName} كخيار ملائم لتمويل مشروعكم لدى ${providerName}. يُنصح بإعداد دراسة الجدوى وتجهيز الفواتير التقديرية قبل موعد مقابلة مسؤول التمويل.`
          : `Le dispositif ${programName} auprès de ${providerName} présente des conditions adaptées à votre profil. Veillez à bien formaliser vos devis pro-forma et votre prévisionnel financier avant l'entretien en agence.`
      });
    }

    const prompt = `You are a senior Tunisian corporate banking & SME financing advisor for Mizen.
Explain in straightforward, professional ${language === 'ar' ? 'Arabic' : 'French'} why the program "${programName}" from "${providerName}" is relevant for this applicant, based on these criteria:
- Matched factors: ${JSON.stringify(reasons?.matchedBecause || [])}
- Potential issues/risks: ${JSON.stringify(reasons?.potentialIssues || [])}
- Needs verification: ${JSON.stringify(reasons?.needsVerification || [])}

Provide:
1. A 2-3 sentence clear synthesis of why this mechanism fits.
2. 3 actionable tips for negotiating with the local branch manager in Tunisia.
3. Common administrative pitfalls to avoid (e.g. valid RNE, CNSS clearance, quote validity).
Keep tone objective, encouraging, and anchored in Tunisian realities (TMM, SOTUGAR, BTS, BFPME procedures). Never promise guaranteed approval.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return res.json({
      success: true,
      source: 'gemini',
      explanation: response.text
    });
  } catch (err) {
    console.error('Gemini explain error:', err);
    res.status(500).json({ error: 'Failed to generate explanation', details: String(err) });
  }
});

/**
 * 3. Document Analysis & Contradiction Detection
 * Analyzes uploaded business plan, RNE, or quote text against user profile
 */
app.post('/api/gemini/analyze-document', async (req, res) => {
  try {
    const { documentText, applicantProfile, language = 'fr' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'fallback',
        analysis: {
          identifiedFields: [
            { key: 'coût_projet', label: 'Coût du projet', extractedValue: 'Détecté dans le document', status: 'matches_profile' },
            { key: 'forme_juridique', label: 'Forme juridique', extractedValue: 'À vérifier avec le RNE', status: 'neutral' }
          ],
          contradictions: [],
          missingMandatoryDocs: ['Extrait RNE récent (- de 3 mois)', 'Attestation de non-faillite', 'Factures proforma signées'],
          recommendations: [
            'Assurez-vous que les montants des devis correspondent exactement au montant du prêt demandé.',
            'Vérifiez la concordance entre la raison sociale et l’objet statutaire au RNE.'
          ]
        }
      });
    }

    const prompt = `You are Mizen's document analysis and compliance checker for Tunisian financing applications.
The applicant declared:
- Project Cost: ${applicantProfile?.totalProjectCost} DT
- Financing Requested: ${applicantProfile?.financingRequested} DT
- User Contribution: ${applicantProfile?.userContribution} DT
- Purpose: ${applicantProfile?.purpose}
- Sector: ${applicantProfile?.sector}
- Business Stage: ${applicantProfile?.businessStage}
- Location: ${applicantProfile?.location}
- Legal Form: ${applicantProfile?.legalStructure}

Here is the document excerpt provided:
"""${documentText}"""

Task:
1. Extract any concrete financial figures, dates, legal forms, or addresses found in the text.
2. Check for CONTRADICTIONS between what the user declared and what is written (e.g. user claims 2 years old, but document shows creation 5 months ago; or devis amount differs from requested funding).
3. Identify missing critical components for a Tunisian bank dossier.
4. Output in JSON in ${language === 'ar' ? 'Arabic' : 'French'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedFields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  label: { type: Type.STRING },
                  extractedValue: { type: Type.STRING },
                  status: { type: Type.STRING }, // 'matches_profile' | 'contradiction' | 'neutral'
                  comment: { type: Type.STRING }
                },
                required: ['key', 'label', 'extractedValue', 'status']
              }
            },
            contradictions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missingMandatoryDocs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['identifiedFields', 'contradictions', 'missingMandatoryDocs', 'recommendations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      analysis: parsed
    });
  } catch (err) {
    console.error('Gemini analyze-document error:', err);
    res.status(500).json({ error: 'Failed to analyze document', details: String(err) });
  }
});

/**
 * 4. Dossier Readiness & Interview Prep
 */
app.post('/api/gemini/dossier-advice', async (req, res) => {
  try {
    const { applicantProfile, selectedPrograms, language = 'fr' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'fallback',
        advice: {
          readinessScore: 75,
          checklist: [
            'Vérifier la validité des devis pro-forma (durée de validité min 60 jours)',
            'Préparer le plan de trésorerie mensuel sur les 12 premiers mois',
            'Rassembler les pièces d’identité et justificatifs de qualification professionnelle',
            'Solliciter la SOTUGAR ou la BFPME pour le cadrage du dossier d’investissement'
          ],
          questionsForOfficer: [
            'Quelle est la quotité d’intervention maximale de la SOTUGAR sur notre secteur ?',
            'Quel est le délai moyen actuel entre la décision du comité et le premier décaissement ?',
            'Existe-t-il des conventions sectorielles réduisant la marge sur TMM ?'
          ]
        }
      });
    }

    const prompt = `You are Mizen's dossier coach preparing an entrepreneur in Tunisia for financing.
Applicant context:
- Project: ${applicantProfile?.purpose}, ${applicantProfile?.financingRequested} DT in ${applicantProfile?.location} (${applicantProfile?.sector})
- Target programs: ${JSON.stringify(selectedPrograms || [])}

Generate a concise, high-impact preparation guide in ${language === 'ar' ? 'Arabic' : 'French'}:
1. Prioritized dossier preparation checklist (actionable, specific to Tunisian administration: RNE, JORT, CNSS, pro-forma, attestation APII).
2. Top 4 key questions the applicant should ask the loan officer during their first bank meeting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            questionsForOfficer: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['checklist', 'questionsForOfficer']
        }
      }
    });

    return res.json({
      success: true,
      source: 'gemini',
      advice: JSON.parse(response.text || '{}')
    });
  } catch (err) {
    console.error('Gemini dossier-advice error:', err);
    res.status(500).json({ error: 'Failed to generate dossier advice', details: String(err) });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mizen Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
