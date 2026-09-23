import { ApplicantProfile, FinancingPurpose, BusinessSector, LegalStructure, BusinessStage } from '../types/financing';

export interface ExtractedIntakeResult {
  detectedAmount?: number;
  extractedProfile: Partial<ApplicantProfile>;
  confidence: number;
  summary: {
    fr: string;
    ar: string;
  };
  missingCrucialFields: string[];
}

export function parseTextToProfileFallback(query: string = '', language: string = 'fr'): Partial<ApplicantProfile> {
  const lower = query.toLowerCase();
  
  // Extract financing amount requested
  const amountMatch = query.match(/(\d+[\d\s.,]*)\s*(dt|dinar|tnd|k\b|mille|ألف|الف|دينار|د)?/i);
  let detectedAmount: number | undefined = undefined;
  if (amountMatch) {
    const cleaned = amountMatch[1].replace(/[\s,]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && parsed > 0) {
      detectedAmount = parsed;
      if (query.includes('ألف') || query.includes('الف') || query.toLowerCase().includes('mille') || query.toLowerCase().includes('k')) {
        if (detectedAmount < 1000) detectedAmount *= 1000;
      }
    }
  }

  // Purpose detection
  let purpose: FinancingPurpose | undefined = undefined;
  if (lower.includes('équipement') || lower.includes('equipement') || lower.includes('matériel') || lower.includes('materiel') || lower.includes('machine') || lower.includes('outillage') || lower.includes('معدات') || lower.includes('آلات') || lower.includes('عتاد')) {
    purpose = 'equipment';
  } else if (lower.includes('création') || lower.includes('creation') || lower.includes('nouveau projet') || lower.includes('بعث') || lower.includes('تأسيس')) {
    purpose = 'creation';
  } else if (lower.includes('roulement') || lower.includes('trésorerie') || lower.includes('tresorerie') || lower.includes('تسيير') || lower.includes('سيولة')) {
    purpose = 'working_capital';
  } else if (lower.includes('agricole') || lower.includes('fella') || lower.includes('فلاحة') || lower.includes('أرض')) {
    purpose = 'agriculture';
  } else if (lower.includes('startup') || lower.includes('innov') || lower.includes('تجديد') || lower.includes('تكنولوج')) {
    purpose = 'innovation_rd';
  } else if (lower.includes('extension') || lower.includes('développement') || lower.includes('croissance') || lower.includes('توسعة')) {
    purpose = 'expansion';
  }

  // Sector detection
  let sector: BusinessSector | undefined = undefined;
  if (lower.includes('textile') || lower.includes('usine') || lower.includes('industr') || lower.includes('صناعة')) {
    sector = 'industry';
  } else if (lower.includes('agri') || lower.includes('fella') || lower.includes('فلاح')) {
    sector = 'agriculture_agribusiness';
  } else if (lower.includes('tech') || lower.includes('logiciel') || lower.includes('app') || lower.includes('برمجة') || lower.includes('digital')) {
    sector = 'ict_tech';
  } else if (lower.includes('artisan') || lower.includes('نجارة') || lower.includes('خياطة') || lower.includes('حرف')) {
    sector = 'crafts_trades';
  } else if (lower.includes('service') || lower.includes('conseil') || lower.includes('خدمات')) {
    sector = 'services';
  } else if (lower.includes('commerce') || lower.includes('boutique') || lower.includes('magasin') || lower.includes('تجارة')) {
    sector = 'commerce';
  } else if (lower.includes('tourisme') || lower.includes('hôtel') || lower.includes('restaurant') || lower.includes('سياحة')) {
    sector = 'tourism';
  } else if (lower.includes('énergie') || lower.includes('solaire') || lower.includes('طاقة')) {
    sector = 'renewable_energy';
  }

  // Location detection
  let location: string | undefined = undefined;
  const arabicGovMap: Record<string, string> = {
    'سوسة': 'Sousse', 'صفاقس': 'Sfax', 'القصرين': 'Kasserine', 'سيدي بوزيد': 'Sidi Bouzid',
    'قفصة': 'Gafsa', 'بنزرت': 'Bizerte', 'نابل': 'Nabeul', 'المنستير': 'Monastir',
    'المهدية': 'Mahdia', 'القيروان': 'Kairouan', 'باجة': 'Béja', 'جندوبة': 'Jendouba',
    'سليانة': 'Siliana', 'الكاف': 'Le Kef', 'مدنين': 'Médenine', 'تطاوين': 'Tataouine',
    'قابس': 'Gabès', 'قبلي': 'Kébili', 'توزر': 'Tozeur', 'زغوان': 'Zaghouan',
    'أريانة': 'Ariana', 'اريانة': 'Ariana', 'بن عروس': 'Ben Arous', 'منوبة': 'La Manouba', 'تونس': 'Tunis'
  };

  for (const [arName, frName] of Object.entries(arabicGovMap)) {
    if (query.includes(arName)) {
      location = frName;
      break;
    }
  }

  if (!location) {
    const frenchGovs = [
      'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba',
      'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
      'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
    ];
    for (const g of frenchGovs) {
      if (lower.includes(g.toLowerCase())) {
        location = g;
        break;
      }
    }
  }

  // ZDR regions list
  const zdrGovernorates = ['Kasserine', 'Sidi Bouzid', 'Gafsa', 'Tataouine', 'Kébili', 'Tozeur', 'Jendouba', 'Le Kef', 'Siliana', 'Béja', 'Kairouan', 'Médenine', 'Gabès', 'Zaghouan'];
  const isZdr = location ? zdrGovernorates.includes(location) : false;

  // Islamic finance indicator
  const isIslamic = lower.includes('islamique') || lower.includes('mourabaha') || lower.includes('halal') || lower.includes('حلال') || lower.includes('إسلامي') || lower.includes('مرابحة');

  // Return strictly extracted fields with ZERO fabricated defaults
  return {
    financingRequested: detectedAmount,
    totalProjectCost: undefined, // Must be entered by user
    userContribution: undefined, // Must be entered by user
    purpose,
    sector,
    location,
    isRegionalDevelopmentZone: isZdr,
    structurePreference: isIslamic ? 'islamic' : 'any',
    // Leave businessStage, legalStructure, hasHigherEducationDegree, hasStartupActLabel as undefined unless explicitly mentioned
    businessStage: undefined,
    legalStructure: undefined,
    hasHigherEducationDegree: undefined,
    hasStartupActLabel: undefined
  };
}
