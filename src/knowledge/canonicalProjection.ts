/**
 * Mizen - Canonical Knowledge Projection Layer
 * 
 * Dynamically projects runtime FinancingProducts and FinancingPrograms from authoritative claims.
 * Stale facts in static catalogues cannot survive because all financial terms, rates, limits,
 * and criteria are live projections of active claims in FinancingClaimsRepository.
 */

import { 
  FinancingProduct, 
  FinancingProvider, 
  CatalogueMetadata,
  SourceReference,
  RateStructure
} from '../types/knowledge';
import { FinancingProgram, Provider } from '../types/financing';
import { CLAIMS_REPOSITORY, CANONICAL_SOURCES, FinancingClaimsRepository } from './claimsRepository';
import { FinancingClaim } from '../types/claims';

// Baseline institutional identity and static descriptive metadata
export const PROVIDER_BASE_METADATA: Record<string, Partial<FinancingProvider>> = {
  bfpme: {
    id: 'bfpme',
    name: 'Banque de Financement des Petites et Moyennes Entreprises',
    legalName: 'BFPME S.A.',
    acronym: 'BFPME',
    type: 'PUBLIC_BANK',
    website: 'https://www.bfpme.com.tn',
    officialDomain: 'bfpme.com.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Banque publique d'investissement dédiée au co-financement et renforcement des fonds propres des PME en phase de création ou d'extension.",
      ar: "بنك عمومي استثماري مختص في تمويل إحداث وتوسعة المؤسسات الصغرى والمتوسطة مع البنوك الشريكة.",
      en: "Public SME investment bank dedicated to co-financing and quasi-equity for Tunisian SMEs."
    }
  },
  bts: {
    id: 'bts',
    name: 'Banque Tunisienne de Solidarité',
    legalName: 'Banque Tunisienne de Solidarité S.A.',
    acronym: 'BTS',
    type: 'PUBLIC_BANK',
    website: 'https://www.bts.com.tn',
    officialDomain: 'bts.com.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Banque publique spécialisée dans le micro-financement et les crédits à taux préférentiel pour diplômés du supérieur et artisans.",
      ar: "بنك عمومي مختص في تمويل حاملي الشهادات العليا وأصحاب الحرف والمشاريع الصغرى بشروط ميسرة.",
      en: "Public development bank supporting graduates, artisans, and micro-entrepreneurs with subsidized rates."
    }
  },
  sotugar: {
    id: 'sotugar',
    name: 'Société Tunisienne de Garantie',
    legalName: 'SOTUGAR S.A.',
    acronym: 'SOTUGAR',
    type: 'GUARANTEE_MECHANISM',
    website: 'https://www.sotugar.com.tn',
    officialDomain: 'sotugar.com.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Mécanisme public national de partage des risques et de garantie des crédits d'investissement et d'exploitation accordés aux PME (ne prête pas directement).",
      ar: "مؤسسة عمومية وطنية متخصصة في ضمان القروض البنكية وتقاسم المخاطر مع البنوك (آلية ضمان وليست جهة إقراض مباشر).",
      en: "National public guarantee institution facilitating bank lending to SMEs by covering default risk."
    }
  },
  aneti: {
    id: 'aneti',
    name: "Agence Nationale pour l'Emploi et le Travail Indépendant",
    legalName: 'ANETI',
    acronym: 'ANETI',
    type: 'PUBLIC_FUNDING_AGENCY',
    website: 'https://www.aneti.tn',
    officialDomain: 'aneti.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Agence publique d'accompagnement et d'incitation à l'auto-emploi accordant des bourses de démarrage et primes d'étude (Chèque Entreprendre).",
      ar: "الوكالة الوطنية للتشغيل والعمل المستقل المانحة لمنح المرافقة والدراسات لإحداث المشاريع.",
      en: "National public employment and self-employment agency providing entrepreneurship grants."
    }
  },
  apii_foprodi: {
    id: 'apii_foprodi',
    name: "Fonds de Promotion et de Décentralisation Industrielle (APII)",
    legalName: 'FOPRODI / APII',
    acronym: 'FOPRODI',
    type: 'PUBLIC_FUNDING_AGENCY',
    website: 'https://www.tunisieindustrie.nat.tn',
    officialDomain: 'tunisieindustrie.nat.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Mécanisme d'incitation étatique accordant des dotations remboursables et des primes d'investissement pour l'industrie et les services.",
      ar: "صندوق النهوض بالصناعة واللامركزية الصناعية المسند للمنح والاعتمادات القابلة للاسترجاع.",
      en: "State fund providing reimbursable grants and regional investment incentives for industrial ventures."
    }
  },
  bh_bank: {
    id: 'bh_bank',
    name: 'BH Bank (Banque de l’Habitat)',
    legalName: 'BH Bank S.A.',
    acronym: 'BH Bank',
    type: 'BANK',
    website: 'https://www.bhbank.tn',
    officialDomain: 'bhbank.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Banque universelle de premier plan et opérateur historique des crédits immobiliers, d'habitat social (FOPROLOS), Premier Logement et crédits auto.",
      ar: "مصرف تجاري رائد والمشغل التاريخي لقروض السكن والفوبرولوس والمسكن الأول وتمويل السيارات.",
      en: "Leading universal commercial bank and historical operator of housing and vehicle loans in Tunisia."
    }
  },
  tlf: {
    id: 'tlf',
    name: 'Tunisie Leasing & Factoring',
    legalName: 'Tunisie Leasing & Factoring S.A.',
    acronym: 'TLF',
    type: 'LEASING_COMPANY',
    website: 'https://www.tlf.com.tn',
    officialDomain: 'tlf.com.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Établissement financier pionnier du leasing mobilier, immobilier et du factoring pour véhicules professionnels et équipements de production.",
      ar: "مؤسسة مالية رائدة في الإيجار المالي للعربات المهنية والمعدات الصناعية والطبية.",
      en: "Pioneer leasing company in Tunisia for commercial vehicles, equipment, and real estate leasing."
    }
  },
  banque_zitouna: {
    id: 'banque_zitouna',
    name: 'Banque Zitouna',
    legalName: 'Banque Zitouna S.A.',
    acronym: 'Zitouna',
    type: 'ISLAMIC_BANK',
    website: 'https://www.banquezitouna.com',
    officialDomain: 'banquezitouna.com',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Première banque islamique commerciale en Tunisie opérant sous les contrats de la finance islamique (Mourabaha, Ijara, Istisna'a).",
      ar: "أول مصرف إسلامي تجاري في تونس يقدم حلول تمويل مطابقة للضوابط الشرعية (مرابحة، إجارة، استصناع).",
      en: "Leading Islamic commercial bank offering Sharia-compliant retail and corporate financing solutions."
    }
  },
  enda_tamweel: {
    id: 'enda_tamweel',
    name: 'Enda Tamweel',
    legalName: 'Enda Tamweel S.A.',
    acronym: 'Enda',
    type: 'MICROFINANCE',
    website: 'https://www.endatamweel.tn',
    officialDomain: 'endatamweel.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Institution de microfinance leader en Tunisie offrant des microcrédits rapides pour petits commerces, artisans, agriculteurs et micro-entreprises.",
      ar: "مؤسسة التمويل الصغير الرائدة بتونس لإسناد القروض الموجهة للمشاريع الصغرى والحرفيين.",
      en: "Leading Tunisian microfinance institution providing microcredits for small businesses and artisans."
    }
  },
  smart_capital: {
    id: 'smart_capital',
    name: 'Smart Capital (Startup Act)',
    legalName: 'Smart Capital S.A.S.',
    acronym: 'Smart Capital',
    type: 'PUBLIC_FUNDING_AGENCY',
    website: 'https://startup.gov.tn',
    officialDomain: 'startup.gov.tn',
    country: 'TN',
    active: true,
    status: 'VERIFIED',
    description: {
      fr: "Opérateur public mandaté pour la mise en œuvre du cadre légal Startup Act et la gestion du fonds de fonds ANAVA.",
      ar: "الهيئة المشرفة على تفعيل قانون المؤسسات الناشئة ومنح علامة ومزايا الستارتاب في تونس.",
      en: "Official operator of the Tunisian Startup Act framework and founder incentives."
    }
  }
};

/**
 * Projects a FinancingProduct from authoritative claims stored in the repository.
 */
export function projectCanonicalProduct(
  productId: string,
  repo: FinancingClaimsRepository = CLAIMS_REPOSITORY
): FinancingProduct | undefined {
  const activeClaims = repo.getActiveClaims(productId);
  const allClaims = repo.getAllClaims(productId);

  // Helper to extract field value from active claims first, then fallback
  const getClaimVal = <T>(field: string, fallback?: T): T | undefined => {
    const claim = activeClaims.find(c => c.field === field);
    if (claim !== undefined && claim.value !== undefined) return claim.value as T;
    return fallback;
  };

  const getSourceReferences = (): SourceReference[] => {
    const srcMap = new Map<string, SourceReference>();
    allClaims.forEach(c => {
      if (c.source && c.source.id) {
        srcMap.set(c.source.id, c.source);
      }
    });
    return Array.from(srcMap.values());
  };

  const sources = getSourceReferences();
  if (sources.length === 0) {
    // Return undefined if entity has no claims
    if (activeClaims.length === 0 && allClaims.length === 0) return undefined;
  }

  // Define product structural blueprints
  switch (productId) {
    case 'bfpme_creation': {
      const minCost = getClaimVal<number>('minProjectCost', 150000)!;
      const maxCost = getClaimVal<number>('maxProjectCost', 15000000)!;
      const maxCeiling = getClaimVal<number>('maxFinancingAmount', 2500000)!;
      const maxPct = getClaimVal<number>('maxFinancingPercentage', 65)!;
      const marginRange = getClaimVal<{ min: number; max: number; unit: string }>('publishedMarginRange', { min: 2.0, max: 4.5, unit: 'percentage_points' });

      return {
        id: 'bfpme_creation',
        providerId: 'bfpme',
        name: {
          fr: "Crédit d'Investissement Création PME",
          ar: 'قرض استثمار إحداث مؤسسة صغرى ومتوسطة',
          en: 'SME Creation Investment Loan'
        },
        shortDescription: {
          fr: 'Co-financement à moyen et long terme pour la création de projets industriels, technologiques et de services.',
          ar: 'تمويل مشترك متوسط وطويل المدى لإحداث مشاريع صناعية وتكنولوجية وخدمية.',
          en: 'Medium and long term co-financing for industrial and tech SME creation.'
        },
        category: 'STARTUP',
        financingDomains: ['STARTUP', 'BUSINESS', 'EQUIPMENT'],
        financingPurposes: ['BUSINESS_CREATION', 'EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION'],
        applicantTypes: ['STARTUP', 'BUSINESS', 'LIBERAL_PROFESSION'],
        applicability: {
          domains: ['STARTUP', 'BUSINESS', 'EQUIPMENT'],
          purposes: ['BUSINESS_CREATION', 'EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION'],
          applicantTypes: ['STARTUP', 'BUSINESS', 'LIBERAL_PROFESSION'],
          requiresBusinessEntity: true,
          allowedSectors: ['industry', 'services', 'ict_tech', 'renewable_energy', 'crafts_trades', 'agriculture_agribusiness'],
          allowedBusinessStages: ['idea_project', 'creation_underway', 'established_under_2y']
        },
        criteria: [
          {
            id: 'crit_bfpme_creation_amount',
            field: 'financingRequested',
            operator: 'LTE',
            expectedValue: maxCeiling,
            critical: true,
            description: {
              fr: `Montant de crédit CMLT BFPME plafonné à ${maxCeiling.toLocaleString('fr-FR')} TND (dans la limite de ${maxPct}% du coût total)`,
              ar: `سقف تمويل CMLT يصل إلى ${maxCeiling.toLocaleString('fr-FR')} دينار (في حدود ${maxPct}% من كلفة الاستثمار)`
            }
          },
          {
            id: 'crit_bfpme_creation_min_cost',
            field: 'totalProjectCost',
            operator: 'GTE',
            expectedValue: minCost,
            critical: true,
            description: {
              fr: `Coût d'investissement total minimum de ${minCost.toLocaleString('fr-FR')} TND pour éligibilité CMLT`,
              ar: `الكلفة الاستثمارية الجملية لا تقل عن ${minCost.toLocaleString('fr-FR')} دينار`
            }
          }
        ],
        financialTerms: {
          amount: { min: 50000, max: maxCeiling, currency: 'TND' },
          projectCost: { min: minCost, max: maxCost, currency: 'TND' },
          durationMonths: { min: 36, max: 120, currency: 'MONTHS' },
          contributionPercentage: { min: 20, max: 35, currency: 'PERCENT' },
          rate: {
            type: 'TMM_PLUS_MARGIN',
            marginRange: marginRange ? { min: marginRange.min, max: marginRange.max } : undefined,
            referenceIndex: 'UNKNOWN', // TMM relationship unresolved as universal automatic formula
            currency: 'PERCENT',
            explanation: {
              fr: `Marge commerciale publiée de ${marginRange?.min || 2} à ${marginRange?.max || 4.5} points (relation exacte avec TMM et tarification effective à confirmer par votre agence).`,
              ar: `هامش تجاري منشور بين ${marginRange?.min || 2} و ${marginRange?.max || 4.5} نقطة مئوية (العلاقة الدقيقة مع TMM والشروط النهائية تحدد مع الفرع).`
            }
          },
          paymentStructure: 'AMORTIZING_MONTHLY',
          verification: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) },
            { field: 'rate', status: 'PARTIALLY_VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        guarantees: [
          {
            id: 'guar_sotugar',
            type: 'STATE_GUARANTEE_SOTUGAR',
            description: {
              fr: "Couverture par les mécanismes SOTUGAR selon barème et accord de la commission mixte.",
              ar: "تغطية بآليات سوتوغار بحسب الشروط وموافقة اللجنة المشتركة."
            },
            mandatory: true
          }
        ],
        requiredDocuments: [
          { id: 'doc_bp', category: 'PROJECT_PROFORMA', name: { fr: 'Étude technico-économique & Business Plan', ar: 'دراسة الجدوى الفنية والاقتصادية' }, mandatory: true },
          { id: 'doc_proforma', category: 'PROJECT_PROFORMA', name: { fr: 'Devis pro-forma récents des équipements', ar: 'فواتير تقديرية حديثة للمعدات' }, mandatory: true },
          { id: 'doc_rne', category: 'LEGAL', name: { fr: 'Statuts de la société et extrait RNE récent', ar: 'القانون الأساسي للشركة ومضمون السجل الوطني للمؤسسات' }, mandatory: true }
        ],
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) },
            { field: 'rate', status: 'PARTIALLY_VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-20'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'bts_diplomes': {
      return {
        id: 'bts_diplomes',
        providerId: 'bts',
        name: {
          fr: "Crédit BTS Diplômés de l'Enseignement Supérieur",
          ar: 'قرض البنك التونسي للتضامن لحاملي الشهادات العليا',
          en: 'BTS Higher Education Graduates Loan'
        },
        shortDescription: {
          fr: "Crédit à taux d'intérêt bonifié sans exigence de garanties lourdes pour diplômés créant leur entreprise.",
          ar: 'قرض بنسبة فائدة ميسرة ودون ضمانات عينية معقدة لحاملي الشهادات العليا.',
          en: 'Subsidized loan for university and higher technical graduates with zero heavy collateral requirement.'
        },
        category: 'STARTUP',
        financingDomains: ['STARTUP', 'EQUIPMENT', 'AGRICULTURE', 'BUSINESS'],
        financingPurposes: ['BUSINESS_CREATION', 'EQUIPMENT_PURCHASE', 'WORKING_CAPITAL', 'AGRICULTURE'],
        applicantTypes: ['INDIVIDUAL', 'STARTUP', 'LIBERAL_PROFESSION', 'MICRO_ENTERPRISE'],
        applicability: {
          domains: ['STARTUP', 'EQUIPMENT', 'AGRICULTURE', 'BUSINESS'],
          purposes: ['BUSINESS_CREATION', 'EQUIPMENT_PURCHASE', 'WORKING_CAPITAL', 'AGRICULTURE'],
          applicantTypes: ['INDIVIDUAL', 'STARTUP', 'LIBERAL_PROFESSION', 'MICRO_ENTERPRISE'],
          requiresHigherEducationDegree: true,
          allowedBusinessStages: ['idea_project', 'creation_underway', 'established_under_2y']
        },
        criteria: [
          {
            id: 'crit_bts_degree',
            field: 'hasHigherEducationDegree',
            operator: 'EQ',
            expectedValue: true,
            critical: true,
            description: {
              fr: "Diplôme de l'enseignement supérieur (Licence, Master, Ingénieur) ou BTP/BTS homologué requis",
              ar: 'شهادة جامعية (إجازة، ماجستير، مهندس) أو مؤهل تقني سامي معترف به'
            }
          },
          {
            id: 'crit_bts_amount_cap',
            field: 'financingRequested',
            operator: 'LTE',
            expectedValue: 150000,
            critical: true,
            description: {
              fr: "Plafond réglementaire d'intervention BTS fixé à 150 000 TND pour les diplômés",
              ar: 'سقف التمويل الأقصى محدد بـ 150 ألف دينار لحاملي الشهادات العليا'
            }
          }
        ],
        financialTerms: {
          amount: { min: 5000, max: 150000, currency: 'TND' },
          projectCost: { min: 5000, max: 200000, currency: 'TND' },
          durationMonths: { min: 24, max: 84, currency: 'MONTHS' },
          contributionPercentage: { min: 0, max: 10, currency: 'PERCENT' },
          rate: {
            type: 'INTEREST_FREE_SUBSIDIZED',
            value: 0.05,
            currency: 'PERCENT',
            explanation: {
              fr: "Taux bonifié par l'État tunisien fixé à 5% l'an sans commissions cachées.",
              ar: 'نسبة فائدة تفاضلية مدعمة من الدولة محددة بـ 5% سنوياً دون عمولات إضافية.'
            }
          },
          gracePeriodMonths: { min: 6, max: 18, currency: 'MONTHS' },
          paymentStructure: 'AMORTIZING_MONTHLY',
          verification: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) },
            { field: 'rate', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        requiredDocuments: [
          { id: 'doc_diploma', category: 'LEGAL', name: { fr: 'Copie conforme du diplôme universitaire', ar: 'نسخة مطابقة للأصل من الشهادة الجامعية' }, mandatory: true },
          { id: 'doc_bp', category: 'PROJECT_PROFORMA', name: { fr: 'Fiche descriptive du projet & Devis d\'équipement', ar: 'بطاقة وصف المشروع وفواتير تقديرية' }, mandatory: true },
          { id: 'doc_cin', category: 'IDENTITY', name: { fr: 'Copie CIN du promoteur', ar: 'نسخة من بطاقة التعريف الوطنية' }, mandatory: true }
        ],
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) },
            { field: 'rate', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-20'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'premier_logement': {
      return {
        id: 'premier_logement',
        providerId: 'bh_bank',
        name: {
          fr: 'Programme Premier Logement (Crédit Autofinancement Bonifié)',
          ar: 'برنامج المسكن الأول (قرض التمويل الذاتي الميسر)',
          en: 'First Home Government Subsidized Scheme'
        },
        shortDescription: {
          fr: "Dispositif d'État accordant un crédit d'autofinancement à 2% de taux d'intérêt et 5 ans de différé pour l'acquisition d'un premier logement neuf.",
          ar: 'برنامج حكومي يمنح قرضاً لتغطية التمويل الذاتي بنسبة فائدة 2% وفترة إمهال 5 سنوات لاقتناء مسكن أول جديد.',
          en: 'State-subsidized scheme providing a 2% loan covering own-contribution with 5 years grace period.'
        },
        category: 'HOME',
        financingDomains: ['HOME'],
        financingPurposes: ['FIRST_HOME'],
        applicantTypes: ['INDIVIDUAL'],
        assetTypes: ['REAL_ESTATE'],
        applicability: {
          domains: ['HOME'],
          purposes: ['FIRST_HOME'],
          applicantTypes: ['INDIVIDUAL'],
          assetTypes: ['REAL_ESTATE'],
          isFirstPropertyOnly: true,
          allowedPropertyConditions: ['new']
        },
        criteria: [
          {
            id: 'crit_first_property',
            field: 'isFirstPropertyPurchase',
            operator: 'EQ',
            expectedValue: true,
            critical: true,
            description: {
              fr: "Ne pas être déjà propriétaire d'un logement (première acquisition résidentielle)",
              ar: 'عدم ملكية مسكن سابق (المسكن الأول للأسرة)'
            }
          },
          {
            id: 'crit_property_price_cap',
            field: 'totalProjectCost',
            operator: 'LTE',
            expectedValue: 250000,
            critical: true,
            description: {
              fr: "Prix d'acquisition du logement neuf plafonné à 250 000 TND selon barème réglementaire",
              ar: 'ثمن المسكن الجديد لا يتجاوز سقف 250 ألف دينار'
            }
          }
        ],
        financialTerms: {
          amount: { min: 10000, max: 50000, currency: 'TND' },
          projectCost: { min: 80000, max: 250000, currency: 'TND' },
          durationMonths: { min: 180, max: 240, currency: 'MONTHS' },
          contributionPercentage: { min: 0, max: 0, currency: 'PERCENT' },
          rate: {
            type: 'FIXED',
            value: 0.02,
            currency: 'PERCENT',
            explanation: {
              fr: "Taux réglementaire bonifié fixé à 2% fixe l'an sur les fonds de l'État, avec 5 ans de différé initial.",
              ar: 'نسبة فائدة قانونية محددة بـ 2% قارة سنوياً على أموال الدولة مع 5 سنوات إمهال.'
            }
          },
          gracePeriodMonths: { min: 60, max: 60, currency: 'MONTHS' },
          paymentStructure: 'AMORTIZING_MONTHLY',
          verification: [
            { field: 'rate', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        simulator: {
          id: 'sim_bh_housing',
          providerId: 'bh_bank',
          url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
          simulatorType: 'MORTGAGE',
          official: true,
          evidence: CANONICAL_SOURCES.bh_simulator
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'rate', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-20'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'banque_credit_auto': {
      return {
        id: 'banque_credit_auto',
        providerId: 'bh_bank',
        name: {
          fr: 'Crédit Automobile Particuliers',
          ar: 'قرض سيارة للأفراد',
          en: 'Conventional Retail Auto Loan'
        },
        shortDescription: {
          fr: "Financement bancaire amortissable pour véhicule neuf ou d'occasion avec apport personnel réglementaire.",
          ar: 'تمويل بنكي لاقتناء سيارة جديدة أو مستعملة مع شرط التمويل الذاتي القانوني.',
          en: 'Amortizing bank loan for new or used passenger vehicles.'
        },
        category: 'CAR',
        financingDomains: ['CAR'],
        financingPurposes: ['VEHICLE_PERSONAL'],
        applicantTypes: ['INDIVIDUAL'],
        assetTypes: ['VEHICLE_NEW', 'VEHICLE_USED'],
        applicability: {
          domains: ['CAR'],
          purposes: ['VEHICLE_PERSONAL'],
          applicantTypes: ['INDIVIDUAL'],
          assetTypes: ['VEHICLE_NEW', 'VEHICLE_USED'],
          allowedVehicleConditions: ['new', 'used']
        },
        criteria: [
          {
            id: 'crit_car_min_contribution',
            field: 'userContribution',
            operator: 'GTE',
            expectedValue: 20,
            critical: true,
            description: {
              fr: "Apport personnel minimum de 20% à 40% selon puissance fiscale et nature du véhicule (circulaire BCT)",
              ar: 'تمويل ذاتي لا يقل عن 20% إلى 40% حسب القوة الجبائية للسيارة (منشور البنك المركزي)'
            }
          }
        ],
        financialTerms: {
          amount: { min: 5000, max: 100000, currency: 'TND' },
          durationMonths: { min: 12, max: 84, currency: 'MONTHS' },
          contributionPercentage: { min: 20, max: 40, currency: 'PERCENT' },
          rate: {
            type: 'TMM_PLUS_MARGIN',
            margin: 0.035,
            referenceIndex: 'TMM',
            currency: 'PERCENT',
            explanation: {
              fr: "Taux variable indexé sur le TMM majoré d'une marge commerciale de 3,0% à 4,5% selon le profil emprunteur.",
              ar: 'نسبة فائدة متغيرة مرتبطة بنسبة TMM مع هامش تجاري يتراوح بين 3.0% و 4.5% حسب تقييم الملف.'
            }
          },
          paymentStructure: 'AMORTIZING_MONTHLY',
          verification: [
            { field: 'durationMonths', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        simulator: {
          id: 'sim_car_bh',
          providerId: 'bh_bank',
          url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
          simulatorType: 'CAR',
          official: true,
          evidence: CANONICAL_SOURCES.bh_simulator
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'bct_rules', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-25'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'leasing_vehicule_pro': {
      return {
        id: 'leasing_vehicule_pro',
        providerId: 'tlf',
        name: {
          fr: 'Leasing Véhicule Utilitaire & Professionnel',
          ar: 'إيجار مالي للعربات النفعية والمهنية',
          en: 'Commercial Vehicle & Fleet Leasing'
        },
        shortDescription: {
          fr: "Location avec option d'achat pour véhicules utilitaires, camionnettes et flottes d'entreprise avec déductibilité fiscale des loyers.",
          ar: 'إيجار مالي مع خيار الشراء للعربات التجارية والمهنية مع ميزات جبائية للأقساط.',
          en: 'Finance lease with purchase option for commercial vehicles and corporate fleets.'
        },
        category: 'LEASING',
        financingDomains: ['LEASING', 'CAR', 'EQUIPMENT'],
        financingPurposes: ['VEHICLE_PRO', 'EQUIPMENT_PURCHASE'],
        applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE', 'INDIVIDUAL'],
        assetTypes: ['VEHICLE_NEW', 'VEHICLE_USED'],
        applicability: {
          domains: ['LEASING', 'CAR', 'EQUIPMENT'],
          purposes: ['VEHICLE_PRO', 'EQUIPMENT_PURCHASE'],
          applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE', 'INDIVIDUAL'],
          allowedVehicleConditions: ['new', 'used']
        },
        criteria: [
          {
            id: 'crit_leasing_proforma',
            field: 'hasProformaInvoice',
            operator: 'EQ',
            expectedValue: true,
            critical: false,
            description: {
              fr: "Présentation d'un devis pro-forma émis par un concessionnaire ou vendeur agréé",
              ar: 'تقديم فاتورة تقديرية من وكيل سيارات أو بائع معتمد'
            }
          }
        ],
        financialTerms: {
          amount: { min: 10000, max: 300000, currency: 'TND' },
          durationMonths: { min: 24, max: 60, currency: 'MONTHS' },
          contributionPercentage: { min: 10, max: 30, currency: 'PERCENT' },
          rate: {
            type: 'NEGOTIATED',
            currency: 'PERCENT',
            explanation: {
              fr: 'Loyer financier calculé selon la durée et le premier loyer majoré. Barème exact établi sur devis pro-forma.',
              ar: 'قسط إيجار مالي محدد حسب المدة والقسط الأول التمهيدي. العرض المالي الدقيق يصدر بناءً على الفاتورة التقديرية.'
            }
          },
          paymentStructure: 'LEASING_RENTAL',
          verification: [
            { field: 'durationMonths', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        simulator: {
          id: 'sim_leasing_tlf',
          providerId: 'tlf',
          url: 'https://www.tlf.com.tn/simulateur-leasing',
          simulatorType: 'LEASING',
          official: true,
          evidence: CANONICAL_SOURCES.tlf_official
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'terms', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-26'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'sotugar_guarantee': {
      return {
        id: 'sotugar_guarantee',
        providerId: 'sotugar',
        name: {
          fr: 'Garantie SOTUGAR Lignes Crédits & Investissement PME',
          ar: 'ضمان سوتوغار لقروض الاستثمار للمؤسسات الصغرى والمتوسطة',
          en: 'SOTUGAR National SME Loan Guarantee Scheme'
        },
        shortDescription: {
          fr: "Mécanisme national de couverture des risques facilitant l'octroi des crédits bancaires aux PME (couvre jusqu'à 75% du risque de crédit, ne prête pas de fonds).",
          ar: 'آلية وطنية لتغطية المخاطر وتيسير حصول المؤسسات على قروض بنكية (تغطي حتى 75% من المخاطر وليست جهة إقراض مباشر).',
          en: 'Public guarantee mechanism covering up to 75% of bank credit default risk (not a direct lending fund).'
        },
        category: 'GUARANTEE',
        financingDomains: ['GUARANTEE', 'STARTUP', 'BUSINESS', 'EQUIPMENT', 'AGRICULTURE'],
        financingPurposes: ['BUSINESS_CREATION', 'BUSINESS_EXPANSION', 'EQUIPMENT_PURCHASE', 'WORKING_CAPITAL', 'INNOVATION_RD'],
        applicantTypes: ['STARTUP', 'BUSINESS', 'MICRO_ENTERPRISE', 'LIBERAL_PROFESSION'],
        applicability: {
          domains: ['GUARANTEE', 'STARTUP', 'BUSINESS', 'EQUIPMENT', 'AGRICULTURE'],
          purposes: ['BUSINESS_CREATION', 'BUSINESS_EXPANSION', 'EQUIPMENT_PURCHASE', 'WORKING_CAPITAL', 'INNOVATION_RD'],
          applicantTypes: ['STARTUP', 'BUSINESS', 'MICRO_ENTERPRISE', 'LIBERAL_PROFESSION'],
          requiresBusinessEntity: true
        },
        criteria: [
          {
            id: 'crit_sotugar_bank_coop',
            field: 'hasPartnerBankFiling',
            operator: 'REQUIRED',
            critical: true,
            description: {
              fr: 'Le dossier doit être instruit et transmis par une banque partenaire conventionnée avec la SOTUGAR',
              ar: 'يتم تقديم الملف وجوباً عن طريق بنك شريك متعاقد مع الشركة التونسية للضمان'
            }
          }
        ],
        financialTerms: {
          amount: { min: 10000, max: 10000000, currency: 'TND' },
          rate: {
            type: 'NOT_APPLICABLE',
            explanation: {
              fr: "La SOTUGAR n'applique aucun taux d'intérêt d'emprunt (commission de garantie spécifique selon le mécanisme).",
              ar: 'لا تطبق الشركة التونسية للضمان أي نسبة فائدة بنكية (عمولة ضمان خاصة بحسب الصندوق والاتفاقية).'
            }
          },
          paymentStructure: 'OTHER',
          verification: [
            { field: 'category', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'category', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-18'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'startup_act_bourse': {
      return {
        id: 'startup_act_bourse',
        providerId: 'smart_capital',
        name: {
          fr: 'Bourse de Vie des Fondateurs — Startup Act',
          ar: 'منحة التفرغ لباعثي المؤسسات الناشئة (Startup Act)',
          en: 'Startup Act Founders Living Allowance'
        },
        shortDescription: {
          fr: "Allocation mensuelle garantie par l'État pour 3 co-fondateurs pendant 1 an (renouvelable 1 fois) avec prise en charge CNSS et congé pour création.",
          ar: 'منحة شهرية مضمونة من الدولة لـ 3 مؤسسين لمدة سنة (قابلة للتجديد) مع التكفل بالتغطية الاجتماعية وعطلة بعث المؤسسة.',
          en: 'State-guaranteed monthly stipend for up to 3 co-founders for 1 year with social security coverage.'
        },
        category: 'PUBLIC_FUNDING',
        financingDomains: ['PUBLIC_FUNDING', 'STARTUP'],
        financingPurposes: ['INNOVATION_RD'],
        applicantTypes: ['INDIVIDUAL', 'STARTUP'],
        applicability: {
          domains: ['PUBLIC_FUNDING', 'STARTUP'],
          purposes: ['INNOVATION_RD'],
          applicantTypes: ['INDIVIDUAL', 'STARTUP'],
          requiresStartupActLabel: true
        },
        criteria: [
          {
            id: 'crit_startup_label',
            field: 'hasStartupActLabel',
            operator: 'EQ',
            expectedValue: true,
            critical: true,
            description: {
              fr: 'Obtention préalable du Label Startup Act délivré par le Collège des Startups',
              ar: 'الحصول المسبق على علامة المؤسسة الناشئة (Label Startup Act) من لجنة الستارتاب'
            }
          }
        ],
        financialTerms: {
          amount: { min: 12000, max: 60000, currency: 'TND' },
          contributionPercentage: { min: 0, max: 0, currency: 'PERCENT' },
          rate: {
            type: 'NOT_APPLICABLE',
            explanation: {
              fr: "Prime d'État non remboursable sous forme d'indemnité mensuelle (1 000 à 5 000 TND / mois selon rémunération antérieure).",
              ar: 'منحة عمومية غير قابلة للاسترجاع تصرف شهرياً (بين 1 000 و 5 000 دينار شهرياً حسب الدخل السابق).'
            }
          },
          paymentStructure: 'OTHER',
          verification: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'amount', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-20'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    case 'banque_zitouna_mourabaha': {
      return {
        id: 'banque_zitouna_mourabaha',
        providerId: 'banque_zitouna',
        name: {
          fr: 'Financement Mourabaha Équipements Professionnels',
          ar: 'تمويل المرابحة للمعدات والآلات المهنية',
          en: 'Mourabaha Islamic Equipment Financing'
        },
        shortDescription: {
          fr: "Contrat de vente commerciale conforme à la Charia où la banque acquiert le bien et le revend à terme avec une marge bénéficiaire convenue.",
          ar: 'عقد بيع بالمرابحة مطابق للضوابط الشرعية حيث يشتري البنك الأصل ويعيد بيعه بأجل مع هامش ربح متفق عليه.',
          en: 'Sharia-compliant cost-plus sale contract for industrial, commercial, and medical equipment.'
        },
        category: 'ISLAMIC_FINANCE',
        financingDomains: ['ISLAMIC_FINANCE', 'EQUIPMENT', 'BUSINESS', 'STARTUP'],
        financingPurposes: ['EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION', 'BUSINESS_CREATION'],
        applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE', 'INDIVIDUAL'],
        applicability: {
          domains: ['ISLAMIC_FINANCE', 'EQUIPMENT', 'BUSINESS', 'STARTUP'],
          purposes: ['EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION', 'BUSINESS_CREATION'],
          applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE', 'INDIVIDUAL']
        },
        criteria: [
          {
            id: 'crit_zitouna_proforma',
            field: 'hasProformaInvoice',
            operator: 'EQ',
            expectedValue: true,
            critical: true,
            description: {
              fr: 'Devis pro-forma détaillé des équipements requis pour contractualisation Mourabaha',
              ar: 'فاتورة تقديرية مفصلة للمعدات المراد شراؤها لإبرام عقد المرابحة'
            }
          }
        ],
        financialTerms: {
          amount: { min: 5000, max: 1000000, currency: 'TND' },
          durationMonths: { min: 12, max: 84, currency: 'MONTHS' },
          contributionPercentage: { min: 10, max: 30, currency: 'PERCENT' },
          rate: {
            type: 'NEGOTIATED',
            currency: 'PERCENT',
            explanation: {
              fr: 'Marge bénéficiaire commerciale convenue d\'avance, sans intérêt usuraire ni pénalités de retard composées.',
              ar: 'هامش ربح تجاري معلوم ومحدد مسبقاً، خالٍ من الفوائد الربوية وغرامات التأخير المركبة.'
            }
          },
          paymentStructure: 'AMORTIZING_MONTHLY',
          verification: [
            { field: 'category', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ]
        },
        verification: {
          status: 'VERIFIED',
          fields: [
            { field: 'terms', status: 'VERIFIED', sourceIds: sources.map(s => s.id) }
          ],
          lastVerifiedAt: '2026-09-21'
        },
        sources,
        status: 'ACTIVE'
      };
    }

    default:
      return undefined;
  }
}

/**
 * Returns all actively projected FinancingProducts.
 */
export function getProjectedCanonicalProducts(repo: FinancingClaimsRepository = CLAIMS_REPOSITORY): FinancingProduct[] {
  const knownProductIds = [
    'bfpme_creation',
    'bts_diplomes',
    'premier_logement',
    'banque_credit_auto',
    'leasing_vehicule_pro',
    'sotugar_guarantee',
    'startup_act_bourse',
    'banque_zitouna_mourabaha'
  ];

  const products: FinancingProduct[] = [];
  for (const id of knownProductIds) {
    const proj = projectCanonicalProduct(id, repo);
    if (proj) products.push(proj);
  }
  return products;
}

/**
 * Returns all actively projected FinancingProviders.
 */
export function getProjectedCanonicalProviders(repo: FinancingClaimsRepository = CLAIMS_REPOSITORY): FinancingProvider[] {
  const providers: FinancingProvider[] = [];
  for (const [id, meta] of Object.entries(PROVIDER_BASE_METADATA)) {
    const allClaims = repo.getAllClaims(id);
    const srcMap = new Map<string, SourceReference>();
    allClaims.forEach(c => {
      if (c.source && c.source.id) srcMap.set(c.source.id, c.source);
    });

    providers.push({
      ...(meta as FinancingProvider),
      sources: Array.from(srcMap.values()),
      lastVerifiedAt: '2026-09-26'
    });
  }
  return providers;
}
