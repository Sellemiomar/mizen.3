/**
 * Mizen - Unified Financing Intelligence Domain Model
 * Unifying Mizen 1's rigorous domain definitions & verification statuses
 * with Mizen 2's modern application capabilities.
 */

export type Language = 'fr' | 'ar';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'OUTDATED'
  | 'UNVERIFIED'
  | 'SOURCE_UNAVAILABLE';

export type ProviderType = 
  | 'public_bank'
  | 'microfinance'
  | 'guarantee_fund'
  | 'public_agency'
  | 'sovereign_fund'
  | 'islamic_bank'
  | 'commercial_bank';

export interface Provider {
  id: string;
  name: string;
  acronym: string;
  type: ProviderType;
  description: {
    fr: string;
    ar: string;
  };
  website: string;
  headquarters: string;
  networkCoverage: {
    fr: string;
    ar: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  officialBadgeText: {
    fr: string;
    ar: string;
  };
}

export type FinancingCategory = 
  | 'bank_loan'
  | 'subsidized_loan'
  | 'microcredit'
  | 'guarantee'
  | 'grant_subsidy'
  | 'equity_quasi_equity'
  | 'islamic_finance';

export type FinancingPurpose = 
  | 'creation'
  | 'equipment'
  | 'working_capital'
  | 'expansion'
  | 'agriculture'
  | 'innovation_rd'
  | 'export';

export type BusinessStage = 
  | 'idea_project'
  | 'creation_underway'
  | 'established_under_2y'
  | 'established_over_2y';

export type BusinessSector = 
  | 'industry'
  | 'services'
  | 'agriculture_agribusiness'
  | 'ict_tech'
  | 'crafts_trades'
  | 'commerce'
  | 'renewable_energy'
  | 'tourism'
  | 'other';

export type LegalStructure = 
  | 'individual'
  | 'suarl'
  | 'sarl'
  | 'sa'
  | 'agricultural_coop'
  | 'not_yet_created';

export interface ApplicantProfile {
  // Core financial figures (Strict Mizen 1 separation)
  totalProjectCost: number;       // Coût total du projet (TND)
  userContribution: number;       // Apport personnel (TND)
  financingRequested: number;     // Financement demandé (TND)

  purpose: FinancingPurpose;
  businessStage: BusinessStage;
  businessAgeYears?: number;
  sector: BusinessSector;
  location: string;               // Gouvernorat (e.g. 'Tunis', 'Sousse', 'Kasserine', etc.)
  isRegionalDevelopmentZone: boolean; // Zone d'encouragement au développement régional (ZDR)
  legalStructure: LegalStructure;

  // Key qualifying traits
  hasStartupActLabel: boolean;
  applicantAge?: number;
  hasHigherEducationDegree: boolean;
  collateralPreference: 'available' | 'limited' | 'none';
  structurePreference: 'standard' | 'islamic' | 'any';

  // Context notes from user
  projectDescription?: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  sourceUrl: string;
  sourceTitle: string;
  sourceType: 'official_portal' | 'decree_law' | 'bank_fiche' | 'public_framework';
  dateChecked: string;
  verifiedFields: string[];
  unverifiedFields: string[];
  notes: {
    fr: string;
    ar: string;
  };
  lastUpdateYear: number;
}

export interface DocumentRequirement {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  category: 'identity' | 'legal' | 'technical_business_plan' | 'financial' | 'quotations_invoices';
  mandatory: boolean;
  details?: {
    fr: string;
    ar: string;
  };
}

export interface FinancingProgram {
  id: string;
  code: string;
  providerId: string;
  name: {
    fr: string;
    ar: string;
  };
  tagline: {
    fr: string;
    ar: string;
  };
  category: FinancingCategory;
  purposes: FinancingPurpose[];
  
  // Financial boundaries
  minAmount: number;             // TND
  maxAmount: number;             // TND
  minContributionPercent: number;// Min % apport personnel requis (e.g. 10%, 20%)
  
  // Terms
  rateType: 'fixed' | 'variable_tmm' | 'subsidized' | 'interest_free' | 'equity' | 'profit_margin';
  rateDescription: {
    fr: string;
    ar: string;
  };
  estimatedRateAnnual?: number;  // Indicatif (e.g. 7.5 or 10.5%)
  durationMonthsMin: number;
  durationMonthsMax: number;
  gracePeriodMonthsMin: number;
  gracePeriodMonthsMax: number;

  // Guarantees & eligibility
  guaranteeRequirements: {
    fr: string;
    ar: string;
  };
  targetAudience: {
    fr: string;
    ar: string;
  };
  eligibilityCriteria: {
    stages: BusinessStage[];
    sectors: BusinessSector[];
    allowedLegalForms: LegalStructure[];
    minAge?: number;
    maxAge?: number;
    requiresDegree?: boolean;
    requiresStartupLabel?: boolean;
    regionalPriorityZonesOnly?: boolean;
    otherRules: {
      fr: string;
      ar: string;
    }[];
  };

  requiredDocuments: DocumentRequirement[];
  applicationSteps: {
    step: number;
    title: {
      fr: string;
      ar: string;
    };
    description: {
      fr: string;
      ar: string;
    };
  }[];
  importantCaveats: {
    fr: string;
    ar: string;
  }[];

  // Traceability & Verification
  verification: VerificationRecord;
}

export interface MatchReason {
  matchedBecause: {
    fr: string;
    ar: string;
  }[];
  potentialIssues: {
    fr: string;
    ar: string;
  }[];
  needsVerification: {
    fr: string;
    ar: string;
  }[];
  eligibilityLevel: 'high' | 'moderate' | 'potential_blockers';
}

export type RateOrigin = 
  | 'official_current_benchmark' // e.g. BCT TMM benchmark
  | 'subsidized_fixed_decree'   // e.g. BTS subsidized rate
  | 'user_provided'             // user entered rate
  | 'estimated_market_spread'   // e.g. TMM + bank margin assumption
  | 'interest_free_grant'       // e.g. 0% for subsidies
  | 'unavailable';              // Rate cannot be reliably determined

export interface CostEstimate {
  canCalculateReliably: boolean;
  rateOrigin?: RateOrigin;
  rateOriginLabel?: {
    fr: string;
    ar: string;
  };
  rateBenchmarkSource?: string;
  rateBenchmarkDate?: string;
  monthlyPayment?: number;
  totalRepayment?: number;
  totalCostOfFinancing?: number;
  assumedRatePercent?: number;
  durationMonths?: number;
  gracePeriodMonths?: number;
  calculationExplanation: {
    fr: string;
    ar: string;
  };
  unreliableReason?: {
    fr: string;
    ar: string;
  };
}

export interface MatchResult {
  program: FinancingProgram;
  provider: Provider;
  reasons: MatchReason;
  costEstimate: CostEstimate;
  compatibilitySummary: {
    fr: string;
    ar: string;
  };
  scoreWeight: number; // Internal ranking aid ONLY, NEVER shown as "approval chance"
}

export interface LeadSubmission {
  id: string;
  createdAt: string;
  applicant: ApplicantProfile;
  selectedProgramIds: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'draft' | 'submitted' | 'processing';
  notes?: string;
}

export interface DocumentAnalysisReport {
  documentName: string;
  identifiedFields: {
    key: string;
    label: string;
    extractedValue: string;
    status: 'matches_profile' | 'contradiction' | 'neutral';
    comment?: string;
  }[];
  missingMandatoryDocs: string[];
  recommendations: string[];
}
