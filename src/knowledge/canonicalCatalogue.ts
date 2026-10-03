/**
 * Mizen - Canonical Financing Knowledge Catalogue
 * Normalized, source-backed repository of Tunisian financing providers, products, and mechanisms.
 * 
 * Compliant with Mizen Knowledge Architecture Repair & Batch 2 Critical Evidence Closure.
 */

import { 
  FinancingProvider, 
  FinancingProduct, 
  CatalogueMetadata,
  SourceReference,
  RuleEvidence,
  KnowledgeClaim
} from '../types/knowledge';

export const CANONICAL_PROVIDERS: FinancingProvider[] = [
  {
    id: 'bfpme',
    name: 'Banque de Financement des Petites et Moyennes Entreprises',
    legalName: 'BFPME S.A.',
    acronym: 'BFPME',
    type: 'PUBLIC_BANK',
    website: 'https://www.bfpme.com.tn',
    officialDomain: 'bfpme.com.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_NOT_CONFIRMED',
    description: {
      fr: 'Banque publique d\'investissement dédiée au co-financement et renforcement des fonds propres des PME en phase de création ou d\'extension.',
      ar: 'بنك عمومي استثماري مختص في تمويل إحداث وتوسعة المؤسسات الصغرى والمتوسطة مع البنوك الشريكة.',
      en: 'Public SME investment bank dedicated to co-financing and quasi-equity for Tunisian SMEs.'
    },
    sources: [
      {
        id: 'src_bfpme_official',
        url: 'https://www.bfpme.com.tn/fr/nos-produits/credit-dinvestissement',
        title: 'Guide des Crédits d\'Investissement BFPME (CMLT)',
        publisher: 'BFPME',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        publishedAt: '2024-01-15',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      },
      {
        id: 'src_bfpme_toolbox',
        url: 'https://www.bfpme.com.tn/fr/boite-outils',
        title: 'BFPME Boîte à outils & formulaires de demande',
        publisher: 'BFPME',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      },
      {
        id: 'src_bfpme_bp_template',
        url: 'https://www.bfpme.com.tn/images/uploads/2021/03/modele_business_plan_extension.xls',
        title: 'Modèle Business Plan Extension BFPME',
        publisher: 'BFPME',
        sourceType: 'DIRECT_PRIMARY_HISTORICAL',
        evidenceStrength: 'DIRECT_PRIMARY_HISTORICAL',
        language: 'fr',
        publishedAt: '2021-03',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_HISTORICAL'
      },
      {
        id: 'src_bfpme_irada_gabes',
        url: 'https://irada.com.tn/regions/gabes/appuis-financiers-detail/?it=157',
        title: 'Fiche Régionale Appuis Financiers BFPME Gabès',
        publisher: 'Irada / BFPME',
        sourceType: 'OFFICIAL_SECONDARY',
        evidenceStrength: 'OFFICIAL_SECONDARY',
        language: 'fr',
        publishedAt: '2021-06-02',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'PARTIALLY_VERIFIED'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'bts',
    name: 'Banque Tunisienne de Solidarité',
    legalName: 'Banque Tunisienne de Solidarité S.A.',
    acronym: 'BTS',
    type: 'PUBLIC_BANK',
    website: 'https://www.bts.com.tn',
    officialDomain: 'bts.com.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Banque publique spécialisée dans le micro-financement et les crédits à taux préférentiel pour diplômés du supérieur et artisans.',
      ar: 'بنك عمومي مختص في تمويل حاملي الشهادات العليا وأصحاب الحرف والمشاريع الصغرى بشروط ميسرة.',
      en: 'Public development bank supporting graduates, artisans, and micro-entrepreneurs with subsidized rates.'
    },
    sources: [
      {
        id: 'src_bts_official',
        url: 'https://www.bts.com.tn/produits-et-services/credits-dinvestissement/',
        title: 'Conditions d\'octroi des crédits BTS',
        publisher: 'BTS',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'sotugar',
    name: 'Société Tunisienne de Garantie',
    legalName: 'SOTUGAR S.A.',
    acronym: 'SOTUGAR',
    type: 'GUARANTEE_MECHANISM',
    website: 'https://www.sotugar.com.tn',
    officialDomain: 'sotugar.com.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_NOT_CONFIRMED',
    description: {
      fr: 'Mécanisme public national de partage des risques et de garantie des crédits bancaires et participations accordés aux PME (ne prête pas directement).',
      ar: 'مؤسسة عمومية وطنية متخصصة في ضمان القروض البنكية والمساهمات وتقاسم المخاطر (آلية ضمان وليست جهة إقراض مباشر).',
      en: 'National public guarantee institution covering unrecoverable default risks for SME bank credits and equity participations.'
    },
    sources: [
      {
        id: 'src_sotugar_fgpme_75_90',
        url: 'https://sotugar.com.tn/fonds-de-garantie-pme-75-90-fgpme-75-90/',
        title: 'Fonds de Garantie PME 75/90 (FGPME 75/90)',
        publisher: 'SOTUGAR',
        sourceType: 'DIRECT_PRIMARY_HISTORICAL',
        evidenceStrength: 'DIRECT_PRIMARY_HISTORICAL',
        language: 'fr',
        publishedAt: '2024-01-23',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_HISTORICAL'
      },
      {
        id: 'src_sotugar_sme_general',
        url: 'https://www.sotugar.com.tn/mecanismes-de-garantie/',
        title: 'Mécanismes de garantie PME classiques SOTUGAR',
        publisher: 'SOTUGAR',
        sourceType: 'DIRECT_PRIMARY_HISTORICAL',
        evidenceStrength: 'DIRECT_PRIMARY_HISTORICAL',
        language: 'fr',
        publishedAt: '2024-01-15',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_HISTORICAL'
      },
      {
        id: 'src_sotugar_startup',
        url: 'https://www.sotugar.com.tn/fonds-de-garantie-des-startups/',
        title: 'Fonds de Garantie des Startups',
        publisher: 'SOTUGAR',
        sourceType: 'DIRECT_PRIMARY_HISTORICAL',
        evidenceStrength: 'DIRECT_PRIMARY_HISTORICAL',
        language: 'fr',
        publishedAt: '2024-01-15',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_HISTORICAL'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'bh_bank',
    name: 'BH Bank',
    legalName: 'BH Bank S.A. (Banque de l\'Habitat)',
    acronym: 'BH',
    type: 'BANK',
    website: 'https://www.bhbank.tn',
    officialDomain: 'bhbank.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Banque universelle leader historique du financement de l\'habitat, de l\'immobilier et des crédits aux particuliers et entreprises en Tunisie.',
      ar: 'بنك شمولي رائد في تمويل السكن والعقارات والقروض الاستهلاكية والمهنية بتونس.',
      en: 'Leading Tunisian universal bank specialized in real estate, housing schemes, and retail banking.'
    },
    sources: [
      {
        id: 'src_bh_simulator',
        url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
        title: 'Simulateur officiel de crédit BH Bank',
        publisher: 'BH Bank',
        sourceType: 'OFFICIAL_SIMULATOR',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'tlf',
    name: 'Tunisie Leasing & Factoring',
    legalName: 'Tunisie Leasing & Factoring S.A.',
    acronym: 'TLF',
    type: 'LEASING_COMPANY',
    website: 'https://www.tlf.com.tn',
    officialDomain: 'tlf.com.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Établissement financier pionnier du leasing mobilier, immobilier et du factoring pour véhicules professionnels et équipements de production.',
      ar: 'مؤسسة مالية رائدة في الإيجار المالي للعربات المهنية والمعدات الصناعية والطبية.',
      en: 'Pioneer leasing company in Tunisia for commercial vehicles, equipment, and real estate leasing.'
    },
    sources: [
      {
        id: 'src_tlf_official',
        url: 'https://www.tlf.com.tn/simulateur-leasing',
        title: 'Simulateur officiel de leasing TLF',
        publisher: 'TLF',
        sourceType: 'OFFICIAL_SIMULATOR',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'banque_zitouna',
    name: 'Banque Zitouna',
    legalName: 'Banque Zitouna S.A.',
    acronym: 'Zitouna',
    type: 'ISLAMIC_BANK',
    website: 'https://www.banquezitouna.com',
    officialDomain: 'banquezitouna.com',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Première banque islamique commerciale en Tunisie opérant sous les contrats de la finance islamique (Mourabaha, Ijara, Istisna\'a).',
      ar: 'أول مصرف إسلامي تجاري في تونس يقدم حلول تمويل مطابقة للضوابط الشرعية (مرابحة، إجارة، استصناع).',
      en: 'Leading Islamic commercial bank offering Sharia-compliant retail and corporate financing solutions.'
    },
    sources: [
      {
        id: 'src_zitouna_mourabaha',
        url: 'https://www.banquezitouna.com/fr/financement-entreprises/mourabaha-equipement',
        title: 'Conditions Mourabaha Entreprises Zitouna',
        publisher: 'Banque Zitouna',
        sourceType: 'OFFICIAL_PRODUCT_PAGE',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'enda_tamweel',
    name: 'Enda Tamweel',
    legalName: 'Enda Tamweel S.A.',
    acronym: 'Enda',
    type: 'MICROFINANCE',
    website: 'https://www.endatamweel.tn',
    officialDomain: 'endatamweel.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Institution de microfinance leader en Tunisie offrant des microcrédits rapides pour petits commerces, artisans, agriculteurs et micro-entreprises.',
      ar: 'مؤسسة التمويل الصغير الرائدة بتونس لإسناد القروض الموجهة للمشاريع الصغرى والحرفيين.',
      en: 'Leading Tunisian microfinance institution providing microcredits for small businesses and artisans.'
    },
    sources: [
      {
        id: 'src_enda_official',
        url: 'https://www.endatamweel.tn/nos-produits/',
        title: 'Produits et microcrédits Enda Tamweel',
        publisher: 'Enda Tamweel',
        sourceType: 'OFFICIAL_PRODUCT_PAGE',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  },
  {
    id: 'smart_capital',
    name: 'Smart Capital (Startup Tunisia)',
    legalName: 'Smart Capital S.A.',
    acronym: 'SmartCapital',
    type: 'PUBLIC_FUNDING_AGENCY',
    website: 'https://startup.gov.tn',
    officialDomain: 'startup.gov.tn',
    country: 'TN',
    active: true,
    status: 'ACTIVE_CONFIRMED',
    description: {
      fr: 'Opérateur national du cadre Startup Act en Tunisie gérant les bourses de vie pour fondateurs et les instruments d\'amorçage.',
      ar: 'المشغل الوطني لإطار قانون المؤسسات الناشئة في تونس المشرف على منحة التفرغ والآليات التحفيزية.',
      en: 'Executive agency for Startup Tunisia managing founder stipends and innovation incentives.'
    },
    sources: [
      {
        id: 'src_startup_act_official',
        url: 'https://startup.gov.tn/fr/startup_act/avantages',
        title: 'Avantages et Bourse des Fondateurs Startup Act',
        publisher: 'Smart Capital / Ministère des TIC',
        sourceType: 'OFFICIAL_REGULATION',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        language: 'fr',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    lastVerifiedAt: '2026-10-03'
  }
];

export const CANONICAL_PRODUCTS: FinancingProduct[] = [
  // 1. PROD-BFPME-CMLT: BFPME Crédit Moyen et Long Terme (Création & Extension)
  {
    id: 'bfpme_creation',
    providerId: 'bfpme',
    name: {
      fr: 'Crédit d\'Investissement PME (CMLT)',
      ar: 'قرض الاستثمار متوسط وطويل المدى للمؤسسات الصغرى والمتوسطة',
      en: 'SME Investment Loan (CMLT)'
    },
    shortDescription: {
      fr: 'Co-financement à moyen et long terme pour projets d\'investissement PME (création et extension) de 150 000 DT à 15 000 000 DT.',
      ar: 'تمويل مشترك متوسط وطويل المدى لمشاريع الاستثمار (إحداث وتوسعة) من 150 ألف دينار إلى 15 مليون دينار.',
      en: 'Medium and long term co-financing for SME investment projects between 150,000 TND and 15,000,000 TND.'
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
      allowedBusinessStages: ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y']
    },
    criteria: [
      {
        id: 'crit_bfpme_project_cost_min',
        field: 'totalProjectCost',
        operator: 'GTE',
        expectedValue: 150000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Coût d\'investissement total minimum de 150 000 TND (vérifié source officielle BFPME)',
          ar: 'الكلفة الاستثمارية الجملية لا تقل عن 150 ألف دينار (موثق رسمياً من BFPME)'
        }
      },
      {
        id: 'crit_bfpme_project_cost_max',
        field: 'totalProjectCost',
        operator: 'LTE',
        expectedValue: 15000000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Coût d\'investissement total maximum de 15 000 000 TND (vérifié source officielle BFPME)',
          ar: 'الكلفة الاستثمارية الجملية لا تتجاوز 15 مليون دينار (موثق رسمياً من BFPME)'
        }
      },
      {
        id: 'crit_bfpme_cmlt_amount_cap',
        field: 'financingRequested',
        operator: 'LTE',
        expectedValue: 2500000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Montant de crédit BFPME plafonné à 2 500 000 TND (2,5 millions DT max par intervention CMLT)',
          ar: 'سقف قرض BFPME لا يتجاوز 2.5 مليون دينار لكل تدخل CMLT'
        }
      },
      {
        id: 'crit_bfpme_cmlt_cost_ratio',
        field: 'financingPercentageOfCost',
        operator: 'LTE',
        expectedValue: 65,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Le crédit CMLT BFPME ne peut excéder 65% du coût total d\'investissement',
          ar: 'لا يمكن أن يتجاوز قرض BFPME نسبة 65% من كلفة الاستثمار الجملية'
        }
      },
      {
        id: 'crit_bfpme_exclusion_hotel',
        field: 'isAccommodationHotel',
        operator: 'EQ',
        expectedValue: false,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Exclusion formelle de l\'hôtellerie d\'hébergement classique (exception possible pour maisons d\'hôtes rurales)',
          ar: 'استثناء رسمي للفندقة الكلاسيكية (مع إمكانية استثناء دور الضيافة الريفية)'
        }
      },
      {
        id: 'crit_bfpme_exclusion_real_estate',
        field: 'isResidentialRealEstateDeveloper',
        operator: 'EQ',
        expectedValue: false,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Exclusion formelle de la promotion immobilière résidentielle',
          ar: 'استثناء رسمي لأنشطة البعث العقاري السكني'
        }
      }
    ],
    financialTerms: {
      amount: { min: 50000, max: 2500000, currency: 'TND' }, // CMLT Ceiling is 2.5m TND
      projectCost: { min: 150000, max: 15000000, currency: 'TND' }, // Project Cost Range: 150k - 15m TND
      durationMonths: { currency: 'MONTHS' }, // UNKNOWN: Project-dependent
      contributionPercentage: { currency: 'PERCENT' }, // UNKNOWN: No universal 20% rule; full-financing conditional
      rate: {
        type: 'TMM_PLUS_MARGIN',
        margin: 0.03, // Published indicative range 2% to 4.5%
        min: 0.02,
        max: 0.045,
        referenceIndex: 'TMM',
        currency: 'PERCENT',
        ruleStatus: 'PARTIALLY_VERIFIED',
        explanation: {
          fr: 'Fourchette de marge publiée de 2% à 4,5% sur TMM; formule exacte et pondération du risque non publiées (PARTIALLY_VERIFIED).',
          ar: 'نطاق هامش منشور بين 2% و 4.5% فوق TMM؛ الصيغة الدقيقة وعوامل المخاطر غير منشورة بالكامل.'
        }
      },
      gracePeriodMonths: { currency: 'MONTHS' }, // UNKNOWN: Project-dependent
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [
        { field: 'projectCost', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'cmltPercentage', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'rate', status: 'PARTIALLY_VERIFIED', sourceIds: ['src_bfpme_official', 'src_bfpme_bp_template'], unknownReason: 'SOURCE_CONFLICT', notes: { fr: 'Marge publiée 2-4,5% mais dépendance au risque non formalisée', ar: 'الهامش 2-4.5% منشور ولكن معادلة المخاطر غير مفصلة' } },
        { field: 'durationMonths', status: 'UNKNOWN', sourceIds: [], unknownReason: 'CONTRACTUAL_TERM', notes: { fr: 'Durée fixée selon la nature du projet lors de l\'instruction', ar: 'المدة تحدد حسب طبيعة المشروع' } },
        { field: 'contributionPercentage', status: 'UNKNOWN', sourceIds: [], unknownReason: 'REQUIRES_PROVIDER_CONFIRMATION', notes: { fr: 'Conditions de financement intégral conditionnées (>= 3 ans d\'activité)', ar: 'شروط التمويل الكلي مشروطة' } }
      ]
    },
    guarantees: [
      {
        id: 'guar_sotugar',
        type: 'STATE_GUARANTEE_SOTUGAR',
        description: {
          fr: 'Intervention potentielle de la SOTUGAR pour le partage des risques (selon éligibilité du mécanisme SOTUGAR).',
          ar: 'إمكانية تدخل الشركة التونسية للضمان سوتوغار لتقاسم المخاطر حسب شروط الآلية المعنية.'
        },
        mandatory: false
      }
    ],
    requiredDocuments: [
      { id: 'doc_bp', category: 'PROJECT_PROFORMA', name: { fr: 'Étude technico-économique & Business Plan (modèle BFPME)', ar: 'دراسة الجدوى الفنية والاقتصادية (نموذج BFPME)' }, mandatory: true, evidenceStatus: 'VERIFIED_CURRENT' },
      { id: 'doc_proforma', category: 'PROJECT_PROFORMA', name: { fr: 'Devis pro-forma récents des équipements', ar: 'فواتير تقديرية حديثة للمعدات' }, mandatory: true, evidenceStatus: 'VERIFIED_CURRENT' },
      { id: 'doc_rne', category: 'LEGAL', name: { fr: 'Statuts de la société et extrait RNE récent', ar: 'القانون الأساسي للشركة ومضمون السجل الوطني للمؤسسات' }, mandatory: true, evidenceStatus: 'VERIFIED_CURRENT' }
    ],
    verification: {
      status: 'PARTIALLY_VERIFIED',
      fields: [
        { field: 'projectCostCeiling', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'cmltLoanCeiling', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'cmltPercentage', status: 'VERIFIED_CURRENT', sourceIds: ['src_bfpme_official'] },
        { field: 'pricingFormula', status: 'PARTIALLY_VERIFIED', sourceIds: ['src_bfpme_official', 'src_bfpme_bp_template'] },
        { field: 'fullFinancingConditions', status: 'PARTIALLY_VERIFIED', sourceIds: ['src_bfpme_irada_gabes'] }
      ],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_bfpme_official',
        url: 'https://www.bfpme.com.tn/fr/nos-produits/credit-dinvestissement',
        title: 'Guide BFPME Crédit Investissement CMLT',
        publisher: 'BFPME',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      },
      {
        id: 'src_bfpme_toolbox',
        url: 'https://www.bfpme.com.tn/fr/boite-outils',
        title: 'BFPME Boîte à outils',
        publisher: 'BFPME',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'PARTIALLY_VERIFIED',
    operationalStatus: 'ACTIVE_NOT_CONFIRMED',
    knowledgeVersion: '2.0.0',
    lastReviewedAt: '2026-10-03',
    claims: [
      {
        id: 'claim_bfpme_cmlt_ceiling',
        programId: 'bfpme_creation',
        field: 'cmltLoanCeiling',
        value: 2500000,
        status: 'VERIFIED_CURRENT',
        evidence: [],
        createdAt: '2026-10-03',
        reviewedAt: '2026-10-03',
        isCurrent: true
      },
      {
        id: 'claim_bfpme_project_cost_ceiling',
        programId: 'bfpme_creation',
        field: 'projectCostCeiling',
        value: 15000000,
        status: 'VERIFIED_CURRENT',
        evidence: [],
        createdAt: '2026-10-03',
        reviewedAt: '2026-10-03',
        isCurrent: true
      }
    ]
  },

  // 2. PROD-SOTUGAR-SME-75-90: Fonds de Garantie PME 75/90 (FGPME 75/90)
  {
    id: 'sotugar_guarantee',
    providerId: 'sotugar',
    name: {
      fr: 'Fonds de Garantie PME 75/90 (FGPME 75/90)',
      ar: 'صندوق ضمان المؤسسات الصغرى والمتوسطة 75/90',
      en: 'SME Guarantee Fund 75/90 (FGPME 75/90)'
    },
    shortDescription: {
      fr: 'Mécanisme public de garantie couvrant 75% à 90% des créances irrécouvrables de crédits et participations dans 14 gouvernorats de l\'intérieur.',
      ar: 'آلية عمومية لتغطية 75% إلى 90% من المبالغ غير المستردة للقروض والمساهمات بـ 14 ولاية داخلية.',
      en: 'Public guarantee mechanism covering 75% to 90% of unrecoverable amounts for loans and equity in 14 interior governorates.'
    },
    category: 'GUARANTEE',
    financingDomains: ['GUARANTEE', 'BUSINESS', 'STARTUP', 'EQUIPMENT'],
    financingPurposes: ['BUSINESS_CREATION', 'BUSINESS_EXPANSION', 'EQUIPMENT_PURCHASE'],
    applicantTypes: ['BUSINESS', 'STARTUP', 'LIBERAL_PROFESSION', 'COOPERATIVE'],
    applicability: {
      domains: ['GUARANTEE', 'BUSINESS', 'STARTUP', 'EQUIPMENT'],
      purposes: ['BUSINESS_CREATION', 'BUSINESS_EXPANSION', 'EQUIPMENT_PURCHASE'],
      applicantTypes: ['BUSINESS', 'STARTUP', 'LIBERAL_PROFESSION', 'COOPERATIVE'],
      requiresBusinessEntity: true,
      allowedGovernorates: [
        'medenine', 'tataouine', 'gabes', 'kebili', 'tozeur', 'gafsa',
        'kasserine', 'sidi_bouzid', 'kairouan', 'le_kef', 'siliana',
        'jendouba', 'beja', 'zaghouan'
      ]
    },
    criteria: [
      {
        id: 'crit_sotugar_fgpme_cost_cap',
        field: 'totalProjectCost',
        operator: 'LTE',
        expectedValue: 15000000,
        critical: true,
        ruleStatus: 'VERIFIED_HISTORICAL',
        description: {
          fr: 'Coût d\'investissement du projet ne dépassant pas 15 000 000 TND (création avec BFR ou extension)',
          ar: 'كلفة استثمار المشروع لا تتجاوز 15 مليون دينار (إحداث مع مال متداول أو توسعة)'
        }
      },
      {
        id: 'crit_sotugar_fgpme_governorates',
        field: 'location',
        operator: 'IN',
        expectedValue: [
          'medenine', 'tataouine', 'gabes', 'kebili', 'tozeur', 'gafsa',
          'kasserine', 'sidi_bouzid', 'kairouan', 'le_kef', 'siliana',
          'jendouba', 'beja', 'zaghouan'
        ],
        critical: true,
        ruleStatus: 'VERIFIED_HISTORICAL',
        description: {
          fr: 'Implantation du projet dans l\'un des 14 gouvernorats de l\'intérieur éligibles au FGPME 75/90',
          ar: 'انتصاب المشروع في إحدى الولايات الداخلية الـ 14 المؤهلة لآلية 75/90'
        }
      }
    ],
    financialTerms: {
      amount: { min: 10000, max: 15000000, currency: 'TND' },
      projectCost: { min: 10000, max: 15000000, currency: 'TND' },
      rate: {
        type: 'NOT_APPLICABLE',
        ruleStatus: 'VERIFIED_HISTORICAL',
        explanation: {
          fr: 'SOTUGAR est un fonds public de garantie et non un prêteur direct (aucun taux d\'intérêt débiteur facturé).',
          ar: 'سوتوغار هي صندوق ضمان عمومي وليست جهة إقراض مباشر (لا تسند قروضاً مباشرة ولا تطبق فوائض بنكية).'
        }
      },
      guaranteeDetails: {
        coveragePercentMin: 75,
        coveragePercentMax: 90,
        coverageBasis: 'UNRECOVERABLE_AMOUNT',
        feeRuleStatus: 'UNKNOWN',
        eligibleBeneficiaries: ['banques', 'sicar', 'fcpr', 'fonds_damorcage'],
        governorates: [
          'medenine', 'tataouine', 'gabes', 'kebili', 'tozeur', 'gafsa',
          'kasserine', 'sidi_bouzid', 'kairouan', 'le_kef', 'siliana',
          'jendouba', 'beja', 'zaghouan'
        ]
      },
      verification: [
        { field: 'coverageBasis', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'governorates', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'guaranteeFee', status: 'UNKNOWN', sourceIds: [], unknownReason: 'REQUIRES_PROVIDER_CONFIRMATION', notes: { fr: 'Commission de garantie non publiée dans la fiche mécanisme', ar: 'عمولة الضمان غير منشورة بصفحة الآلية' } }
      ]
    },
    verification: {
      status: 'VERIFIED_HISTORICAL',
      fields: [
        { field: 'officialName', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'legalBasis', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'geographicScope', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'coverageBasis', status: 'VERIFIED_HISTORICAL', sourceIds: ['src_sotugar_fgpme_75_90'] },
        { field: 'operationalStatus', status: 'UNKNOWN', sourceIds: ['src_sotugar_fgpme_75_90'], unknownReason: 'PRODUCT_STATUS_UNKNOWN' }
      ],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_sotugar_fgpme_75_90',
        url: 'https://sotugar.com.tn/fonds-de-garantie-pme-75-90-fgpme-75-90/',
        title: 'Fonds de Garantie PME 75/90 (FGPME 75/90)',
        publisher: 'SOTUGAR',
        sourceType: 'DIRECT_PRIMARY_HISTORICAL',
        evidenceStrength: 'DIRECT_PRIMARY_HISTORICAL',
        publishedAt: '2024-01-23',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_HISTORICAL'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_HISTORICAL',
    operationalStatus: 'ACTIVE_NOT_CONFIRMED',
    knowledgeVersion: '1.2.0',
    lastReviewedAt: '2026-10-03'
  },

  // 3. BTS Diplômés
  {
    id: 'bts_diplomes',
    providerId: 'bts',
    name: {
      fr: 'Crédit BTS Diplômés de l\'Enseignement Supérieur',
      ar: 'قرض البنك التونسي للتضامن لحاملي الشهادات العليا',
      en: 'BTS Higher Education Graduates Loan'
    },
    shortDescription: {
      fr: 'Crédit à taux d\'intérêt bonifié sans exigence de garanties lourdes pour diplômés créant leur entreprise.',
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
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Diplôme de l\'enseignement supérieur (Licence, Master, Ingénieur) ou BTP/BTS homologué requis',
          ar: 'شهادة جامعية (إجازة، ماجستير، مهندس) أو مؤهل تقني سامي معترف به'
        }
      },
      {
        id: 'crit_bts_amount_cap',
        field: 'financingRequested',
        operator: 'LTE',
        expectedValue: 150000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Plafond de financement fixé à 150 000 TND pour les diplômés de l\'enseignement supérieur',
          ar: 'سقف التمويل محدد بـ 150 ألف دينار لحاملي شهادات التعليم العالي'
        }
      }
    ],
    financialTerms: {
      amount: { min: 5000, max: 150000, currency: 'TND' },
      durationMonths: { min: 24, max: 84, currency: 'MONTHS' },
      contributionPercentage: { min: 10, max: 20, currency: 'PERCENT' },
      rate: {
        type: 'FIXED',
        value: 0.06,
        currency: 'PERCENT',
        ruleStatus: 'VERIFIED_CURRENT',
        explanation: {
          fr: 'Taux d\'intérêt bonifié réglementé par convention d\'État (5% à 7% l\'an).',
          ar: 'نسبة فائدة ميسرة مدعومة من الدولة (5% إلى 7% سنوياً).'
        }
      },
      gracePeriodMonths: { min: 6, max: 24, currency: 'MONTHS' },
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [
        { field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bts_official'] },
        { field: 'rate', status: 'VERIFIED_CURRENT', sourceIds: ['src_bts_official'] },
        { field: 'durationMonths', status: 'VERIFIED_CURRENT', sourceIds: ['src_bts_official'] }
      ]
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [
        { field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bts_official'] },
        { field: 'rate', status: 'VERIFIED_CURRENT', sourceIds: ['src_bts_official'] }
      ],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_bts_official',
        url: 'https://www.bts.com.tn/produits-et-services/credits-dinvestissement/',
        title: 'Fiche Produit BTS Diplômés',
        publisher: 'BTS',
        sourceType: 'DIRECT_PRIMARY_CURRENT',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        retrievedAt: '2026-10-03',
        lastVerifiedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  },

  // 4. Premier Logement (BH Bank)
  {
    id: 'premier_logement',
    providerId: 'bh_bank',
    name: {
      fr: 'Crédit Premier Logement (Fonds National)',
      ar: 'قرض المسكن الأول (البرنامج الوطني)',
      en: 'First Home Subsidized Mortgage'
    },
    shortDescription: {
      fr: 'Dispositif national pour financer l\'autofinancement (jusqu\'à 20%) et le crédit principal pour un premier logement.',
      ar: 'آلية وطنية لتغطية التمويل الذاتي (حتى 20%) والقرض البنكي للمسكن الأول.',
      en: 'National housing program funding down payment and subsidized mortgage for middle-class first-time buyers.'
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
      allowedPropertyConditions: ['new', 'existing']
    },
    criteria: [
      {
        id: 'crit_first_home_only',
        field: 'isFirstProperty',
        operator: 'EQ',
        expectedValue: true,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Réservé aux primo-accédants ne possédant aucun logement au préalable',
          ar: 'مخصص للمقتنين لأول مرة الذين لا يملكون أي عقار سكني'
        }
      },
      {
        id: 'crit_property_price_cap',
        field: 'propertyPrice',
        operator: 'LTE',
        expectedValue: 220000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Prix du logement plafonné à 220 000 TND selon le barème du ministère de l\'Équipement',
          ar: 'سعر المسكن محدد بسقف 220 ألف دينار وفق كراس شروط وزارة التجهيز'
        }
      }
    ],
    financialTerms: {
      amount: { min: 20000, max: 200000, currency: 'TND' },
      projectCost: { min: 40000, max: 220000, currency: 'TND' },
      durationMonths: { min: 120, max: 300, currency: 'MONTHS' },
      rate: {
        type: 'FIXED',
        value: 0.075,
        currency: 'PERCENT',
        ruleStatus: 'VERIFIED_CURRENT',
        explanation: {
          fr: 'Taux bonifié de l\'apport (2% avec différé de 5 ans) + taux bonifié sur crédit principal (TMM + marge plafonnée).',
          ar: 'نسبة تفاضلية للتمويل الذاتي (2% مع إمهال 5 سنوات) + نسبة ميسرة على القرض الأصلي.'
        }
      },
      gracePeriodMonths: { min: 0, max: 60, currency: 'MONTHS' },
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [
        { field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bh_simulator'] }
      ]
    },
    simulator: {
      id: 'sim_bh_premier_logement',
      providerId: 'bh_bank',
      productId: 'premier_logement',
      url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
      simulatorType: 'MORTGAGE',
      official: true,
      evidence: {
        id: 'src_bh_simulator',
        url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
        publisher: 'BH Bank',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bh_simulator'] }],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_bh_simulator',
        url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
        publisher: 'BH Bank',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  },

  // 5. Crédit Auto BH Bank
  {
    id: 'banque_credit_auto',
    providerId: 'bh_bank',
    name: {
      fr: 'Crédit Auto Particuliers (BH Bank)',
      ar: 'قرض شراء سيارة للأفراد (بنك الإسكان)',
      en: 'Auto Loan for Individuals (BH Bank)'
    },
    shortDescription: {
      fr: 'Financement bancaire pour l\'acquisition d\'un véhicule neuf ou d\'occasion avec quotité réglementée.',
      ar: 'تمويل بنكي لاقتناء سيارة جديدة أو مستعملة وفق الضوابط المعمول بها.',
      en: 'Conventional auto loan for individuals with BCT auto-financing regulatory compliance.'
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
        id: 'crit_auto_amount_cap',
        field: 'financingRequested',
        operator: 'LTE',
        expectedValue: 100000,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Montant maximum de crédit auto fixé à 100 000 TND selon la capacité d\'endettement (40% du revenu)',
          ar: 'السقف الأقصى لقرض السيارة 100 ألف دينار حسب قدرة السداد (40% من الدخل)'
        }
      }
    ],
    financialTerms: {
      amount: { min: 5000, max: 100000, currency: 'TND' },
      projectCost: { min: 10000, max: 200000, currency: 'TND' },
      durationMonths: { min: 12, max: 84, currency: 'MONTHS' },
      contributionPercentage: { min: 20, max: 40, currency: 'PERCENT' },
      rate: {
        type: 'TMM_PLUS_MARGIN',
        margin: 0.035,
        referenceIndex: 'TMM',
        currency: 'PERCENT',
        ruleStatus: 'PARTIALLY_VERIFIED',
        explanation: {
          fr: 'Indexé sur TMM + marge commerciale de la banque (autour de 3,5% à 4,5%).',
          ar: 'مرتبط بمعدل TMM + هامش البنك التجاري.'
        }
      },
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bh_simulator'] }]
    },
    simulator: {
      id: 'sim_bh_auto',
      providerId: 'bh_bank',
      productId: 'banque_credit_auto',
      url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
      simulatorType: 'CAR',
      official: true,
      evidence: {
        id: 'src_bh_simulator',
        url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
        publisher: 'BH Bank',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_bh_simulator'] }],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_bh_simulator',
        url: 'https://www.bhbank.tn/particuliers/simulateur-de-credit',
        publisher: 'BH Bank',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  },

  // 6. Leasing Véhicule Pro (TLF)
  {
    id: 'leasing_vehicule_pro',
    providerId: 'tlf',
    name: {
      fr: 'Leasing Véhicule Professionnel & Utilitaire',
      ar: 'إيجار مالي للعربات المهنية والتجارية (ليزينغ)',
      en: 'Commercial Vehicle Leasing (TLF)'
    },
    shortDescription: {
      fr: 'Formule de crédit-bail pour l\'acquisition de véhicules utilitaires et de fonction avec déductibilité fiscale des loyers.',
      ar: 'صيغة إيجار مالي لاقتناء السيارات النفعية وعربات العمل مع امتيازات جبائية.',
      en: 'Leasing contract for utility and corporate vehicles with tax-deductible monthly rentals.'
    },
    category: 'LEASING',
    financingDomains: ['LEASING', 'CAR', 'EQUIPMENT'],
    financingPurposes: ['VEHICLE_PRO', 'EQUIPMENT_PURCHASE'],
    applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE'],
    assetTypes: ['VEHICLE_NEW', 'VEHICLE_USED', 'INDUSTRIAL_EQUIPMENT'],
    applicability: {
      domains: ['LEASING', 'CAR', 'EQUIPMENT'],
      purposes: ['VEHICLE_PRO', 'EQUIPMENT_PURCHASE'],
      applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'MICRO_ENTERPRISE'],
      requiresBusinessEntity: true
    },
    criteria: [
      {
        id: 'crit_leasing_tax_id',
        field: 'hasTaxIdentification',
        operator: 'EQ',
        expectedValue: true,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Réservé aux professionnels titulaires d\'une matricule fiscale (patente ou registre de commerce RNE)',
          ar: 'مخصص للمهنيين والشركات الحاملين لمعرف جبائي قانوني (باتيندا أو سجل تجاري)'
        }
      }
    ],
    financialTerms: {
      amount: { min: 10000, max: 500000, currency: 'TND' },
      projectCost: { min: 10000, max: 600000, currency: 'TND' },
      durationMonths: { min: 24, max: 60, currency: 'MONTHS' },
      rate: {
        type: 'TMM_PLUS_MARGIN',
        margin: 0.035,
        referenceIndex: 'TMM',
        currency: 'PERCENT',
        ruleStatus: 'PARTIALLY_VERIFIED',
        explanation: {
          fr: 'Loyer financier indexé sur le TMM + marge du bailleur (simulation précise subordonnée à l\'offre ferme).',
          ar: 'إيجار مالي مرتبط بـ TMM + هامش المؤجر.'
        }
      },
      paymentStructure: 'LEASING_RENTAL',
      verification: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_tlf_official'] }]
    },
    simulator: {
      id: 'sim_tlf_leasing',
      providerId: 'tlf',
      productId: 'leasing_vehicule_pro',
      url: 'https://www.tlf.com.tn/simulateur-leasing',
      simulatorType: 'LEASING',
      official: true,
      evidence: {
        id: 'src_tlf_official',
        url: 'https://www.tlf.com.tn/simulateur-leasing',
        publisher: 'TLF',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_tlf_official'] }],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_tlf_official',
        url: 'https://www.tlf.com.tn/simulateur-leasing',
        publisher: 'TLF',
        sourceType: 'OFFICIAL_SIMULATOR',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  },

  // 7. Smart Capital - Bourse Startup Act
  {
    id: 'startup_act_bourse',
    providerId: 'smart_capital',
    name: {
      fr: 'Bourse des Fondateurs (Startup Act)',
      ar: 'منحة التفرغ لمؤسسي الشركات الناشئة (قانون المؤسسات الناشئة)',
      en: 'Founder Stipend (Startup Act)'
    },
    shortDescription: {
      fr: 'Allocation mensuelle d\'une année renouvelable (jusqu\'à 5 000 DT/mois) pour les fondateurs détenant le label Startup Act.',
      ar: 'منحة شهرية لمدة سنة قابلة للتجديد (حتى 5000 د/شهرياً) لمؤسسي الشركات الحاصلة على علامة Startup Act.',
      en: 'Monthly grant up to 5,000 TND/month for co-founders of labeled startups dedicating full-time to their venture.'
    },
    category: 'STARTUP',
    financingDomains: ['STARTUP', 'PUBLIC_FUNDING'],
    financingPurposes: ['BUSINESS_CREATION', 'INNOVATION_RD'],
    applicantTypes: ['STARTUP', 'INDIVIDUAL'],
    applicability: {
      domains: ['STARTUP', 'PUBLIC_FUNDING'],
      purposes: ['BUSINESS_CREATION', 'INNOVATION_RD'],
      applicantTypes: ['STARTUP', 'INDIVIDUAL'],
      requiresStartupActLabel: true
    },
    criteria: [
      {
        id: 'crit_startup_act_label',
        field: 'hasStartupActLabel',
        operator: 'EQ',
        expectedValue: true,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Obtention formelle du label Startup accordé par le Collège du Startup Act',
          ar: 'الحصول رسمياً على علامة مؤسسة ناشئة (Label Startup) من لجنة قانون المؤسسات الناشئة'
        }
      }
    ],
    financialTerms: {
      amount: { min: 12000, max: 60000, currency: 'TND' },
      rate: {
        type: 'INTEREST_FREE_SUBSIDIZED',
        value: 0,
        currency: 'PERCENT',
        ruleStatus: 'VERIFIED_CURRENT',
        explanation: {
          fr: 'Subvention directe de vie 100% non remboursable accordée par l\'État tunisien.',
          ar: 'منحة مباشرة غير قابلة للاسترجاع مقدمة من الدولة التونسية.'
        }
      },
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_startup_act_official'] }]
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [{ field: 'labelRequirement', status: 'VERIFIED_CURRENT', sourceIds: ['src_startup_act_official'] }],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_startup_act_official',
        url: 'https://startup.gov.tn/fr/startup_act/avantages',
        publisher: 'Smart Capital / Ministère des TIC',
        sourceType: 'OFFICIAL_REGULATION',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  },

  // 8. Banque Zitouna - Mourabaha Équipement
  {
    id: 'banque_zitouna_mourabaha',
    providerId: 'banque_zitouna',
    name: {
      fr: 'Mourabaha Équipements Professionnels (Banque Zitouna)',
      ar: 'مرابحة اقتناء التجهيزات المهنية (مصرف الزيتونة)',
      en: 'Mourabaha Equipment Financing (Banque Zitouna)'
    },
    shortDescription: {
      fr: 'Financement islamique conforme à la Sharia pour l\'acquisition de machines, outillages et équipements industriels.',
      ar: 'تمويل إسلامي مطابق للضوابط الشرعية لاقتناء الآلات والمعدات والتجهيزات الصناعية والمهنية.',
      en: 'Sharia-compliant cost-plus profit installment financing for production equipment and business assets.'
    },
    category: 'ISLAMIC_FINANCE',
    financingDomains: ['ISLAMIC_FINANCE', 'EQUIPMENT', 'BUSINESS'],
    financingPurposes: ['EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION'],
    applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'AGRICULTURAL_EXPLOITATION'],
    assetTypes: ['INDUSTRIAL_EQUIPMENT', 'AGRICULTURAL_EQUIPMENT'],
    applicability: {
      domains: ['ISLAMIC_FINANCE', 'EQUIPMENT', 'BUSINESS'],
      purposes: ['EQUIPMENT_PURCHASE', 'BUSINESS_EXPANSION'],
      applicantTypes: ['BUSINESS', 'LIBERAL_PROFESSION', 'STARTUP', 'AGRICULTURAL_EXPLOITATION'],
      requiresBusinessEntity: true
    },
    criteria: [
      {
        id: 'crit_mourabaha_proforma',
        field: 'hasProformaInvoice',
        operator: 'EQ',
        expectedValue: true,
        critical: true,
        ruleStatus: 'VERIFIED_CURRENT',
        description: {
          fr: 'Fourniture obligatoire d\'une facture pro-forma ou devis fournisseur conforme aux règles Mourabaha',
          ar: 'ضرورة تقديم فاتورة تقديرية من المزود مطابقة لشروط عقد المرابحة'
        }
      }
    ],
    financialTerms: {
      amount: { min: 10000, max: 1500000, currency: 'TND' },
      projectCost: { min: 10000, max: 2000000, currency: 'TND' },
      durationMonths: { min: 12, max: 84, currency: 'MONTHS' },
      rate: {
        type: 'NEGOTIATED',
        currency: 'PERCENT',
        ruleStatus: 'PARTIALLY_VERIFIED',
        explanation: {
          fr: 'Marge bénéficiaire convenue lors de l\'offre formelle (sans intérêts usuraires).',
          ar: 'هامش ربح معلوم يتفق عليه في العرض الرسمي دون فوائض ربوية.'
        }
      },
      paymentStructure: 'AMORTIZING_MONTHLY',
      verification: [{ field: 'amount', status: 'VERIFIED_CURRENT', sourceIds: ['src_zitouna_mourabaha'] }]
    },
    verification: {
      status: 'VERIFIED_CURRENT',
      fields: [{ field: 'structure', status: 'VERIFIED_CURRENT', sourceIds: ['src_zitouna_mourabaha'] }],
      lastVerifiedAt: '2026-10-03'
    },
    sources: [
      {
        id: 'src_zitouna_mourabaha',
        url: 'https://www.banquezitouna.com/fr/financement-entreprises/mourabaha-equipement',
        publisher: 'Banque Zitouna',
        sourceType: 'OFFICIAL_PRODUCT_PAGE',
        evidenceStrength: 'DIRECT_PRIMARY_CURRENT',
        retrievedAt: '2026-10-03',
        evidenceStatus: 'VERIFIED_CURRENT'
      }
    ],
    status: 'ACTIVE',
    ruleStatus: 'VERIFIED_CURRENT',
    operationalStatus: 'ACTIVE_CONFIRMED',
    knowledgeVersion: '1.0.0',
    lastReviewedAt: '2026-10-03'
  }
];

export const CANONICAL_METADATA: CatalogueMetadata = {
  version: '2.0.0',
  generatedAt: '2026-10-03T07:00:00Z',
  lastRefreshAt: '2026-10-03T07:00:00Z',
  sourceCount: 15,
  providerCount: CANONICAL_PROVIDERS.length,
  productCount: CANONICAL_PRODUCTS.length,
  productsRequiringReview: 1
};
