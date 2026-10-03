/**
 * Mizen - Canonical Financing Knowledge Layer Domain Model
 * Structured, source-backed representation of the Tunisian financing market.
 * 
 * Non-negotiable principles:
 * 1. Mizen must never be more confident than its evidence.
 * 2. A published rule is not automatically an operational product.
 * 3. Operational status is separate from rule status.
 * 4. PARTIALLY_VERIFIED must NEVER be treated as HIGH evidence confidence.
 * 5. Historical evidence must never silently become a current eligibility rule.
 * 6. UNKNOWN must remain UNKNOWN.
 * 7. Missing data must never be replaced with guessed defaults.
 * 8. A guarantee is not financing.
 */

export type KnowledgeRuleStatus =
  | 'VERIFIED_CURRENT'
  | 'VERIFIED_HISTORICAL'
  | 'PARTIALLY_VERIFIED'
  | 'UNVERIFIED'
  | 'OUTDATED'
  | 'UNKNOWN';

export type OperationalStatus =
  | 'ACTIVE_CONFIRMED'
  | 'ACTIVE_NOT_CONFIRMED'
  | 'CLOSED_CONFIRMED'
  | 'SUSPENDED'
  | 'REPLACED'
  | 'UNKNOWN';

export type ApplicabilityScope =
  | 'UNIVERSAL'
  | 'CONDITIONAL'
  | 'PRODUCT_SPECIFIC'
  | 'CUSTOMER_SPECIFIC'
  | 'GEOGRAPHICALLY_CONDITIONAL'
  | 'UNKNOWN';

export type EvidenceStrength =
  | 'DIRECT_PRIMARY_CURRENT'
  | 'DIRECT_PRIMARY_HISTORICAL'
  | 'OFFICIAL_SECONDARY'
  | 'HIGH_QUALITY_SECONDARY'
  | 'UNVERIFIED';

export type UnknownReason =
  | 'NOT_FOUND'
  | 'SOURCE_CONFLICT'
  | 'SOURCE_OUTDATED'
  | 'SOURCE_NOT_CURRENT'
  | 'PRODUCT_STATUS_UNKNOWN'
  | 'MECHANISM_SPECIFIC_RULE_UNKNOWN'
  | 'LENDER_DISCRETION'
  | 'CONTRACTUAL_TERM'
  | 'MISSING_DOCUMENT'
  | 'REQUIRES_PROVIDER_CONFIRMATION'
  | 'OTHER';

export type FinancingProviderType =
  | 'BANK'
  | 'LEASING_COMPANY'
  | 'MICROFINANCE'
  | 'PUBLIC_FUNDING_AGENCY'
  | 'GUARANTEE_MECHANISM'
  | 'PUBLIC_BANK'
  | 'ISLAMIC_BANK'
  | 'INVESTMENT_FUND'
  | 'OTHER';

export interface LocalizedText {
  fr?: string;
  ar?: string;
  en?: string;
}

export type SourceType =
  | 'OFFICIAL_PRODUCT_PAGE'
  | 'OFFICIAL_SIMULATOR'
  | 'OFFICIAL_PDF'
  | 'OFFICIAL_REGULATION'
  | 'OFFICIAL_NOTICE'
  | 'OFFICIAL_DOCUMENT'
  | 'DIRECT_PRIMARY_CURRENT'
  | 'DIRECT_PRIMARY_HISTORICAL'
  | 'OFFICIAL_SECONDARY'
  | 'HIGH_QUALITY_SECONDARY'
  | 'OTHER';

export type EvidenceStatus =
  | 'VERIFIED_CURRENT'
  | 'VERIFIED_HISTORICAL'
  | 'PARTIALLY_VERIFIED'
  | 'UNVERIFIED'
  | 'OUTDATED'
  | 'SOURCE_UNAVAILABLE'
  | 'UNKNOWN';

export interface SourceReference {
  id: string;
  url: string;
  title?: string;
  publisher: string;
  sourceType: SourceType | string;
  evidenceStrength?: EvidenceStrength;
  language?: 'fr' | 'ar' | 'en';
  publishedAt?: string;
  retrievedAt: string;
  lastVerifiedAt?: string;
  relevantSection?: string;
  evidenceStatus: EvidenceStatus | string;
}

export interface RuleEvidence {
  field: string;
  status: KnowledgeRuleStatus;
  value?: unknown;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceType?: string;
  evidenceStrength: EvidenceStrength;
  checkedAt?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  lastKnownUpdateDate?: string;
  unknownReason?: UnknownReason;
  notes?: LocalizedText;
}

export interface FieldEvidence {
  field: string;
  status: EvidenceStatus | KnowledgeRuleStatus;
  sourceIds: string[];
  verifiedAt?: string;
  unknownReason?: UnknownReason;
  notes?: LocalizedText;
}

export interface ProductVerification {
  status: EvidenceStatus | KnowledgeRuleStatus;
  fields: FieldEvidence[];
  lastVerifiedAt?: string;
}

export interface KnowledgeClaim {
  id: string;
  programId: string;
  field: string;
  value: unknown;
  status: KnowledgeRuleStatus;
  evidence: RuleEvidence[];
  createdAt: string;
  reviewedAt?: string;
  supersedesClaimId?: string;
  isCurrent: boolean;
  notes?: LocalizedText;
}

export interface KnowledgeVersion {
  version: string;
  programId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  supersedesVersion?: string;
  changelog: string;
  claims: KnowledgeClaim[];
}

export interface FinancingProvider {
  id: string;
  name: string;
  legalName?: string;
  acronym?: string;
  type: FinancingProviderType;
  website?: string;
  officialDomain?: string;
  country: 'TN';
  description?: LocalizedText;
  active: boolean;
  status: OperationalStatus | 'DISCOVERED' | 'UNDER_REVIEW' | 'VERIFIED' | 'INACTIVE';
  sources: SourceReference[];
  lastVerifiedAt?: string;
}

export type FinancingDomain =
  | 'HOME'
  | 'CAR'
  | 'CONSUMER'
  | 'STARTUP'
  | 'BUSINESS'
  | 'EQUIPMENT'
  | 'LEASING'
  | 'AGRICULTURE'
  | 'PUBLIC_FUNDING'
  | 'GUARANTEE'
  | 'MICROFINANCE'
  | 'ISLAMIC_FINANCE'
  | 'OTHER';

export type ApplicantType =
  | 'INDIVIDUAL'
  | 'BUSINESS'
  | 'STARTUP'
  | 'AGRICULTURAL_EXPLOITATION'
  | 'LIBERAL_PROFESSION'
  | 'MICRO_ENTERPRISE'
  | 'COOPERATIVE';

export type AssetType =
  | 'REAL_ESTATE'
  | 'VEHICLE_NEW'
  | 'VEHICLE_USED'
  | 'INDUSTRIAL_EQUIPMENT'
  | 'AGRICULTURAL_EQUIPMENT'
  | 'WORKING_CAPITAL'
  | 'INTANGIBLE_INNOVATION';

export type ProductPurpose =
  | 'FIRST_HOME'
  | 'HOME_CONSTRUCTION'
  | 'HOME_RENOVATION'
  | 'VEHICLE_PERSONAL'
  | 'VEHICLE_PRO'
  | 'BUSINESS_CREATION'
  | 'BUSINESS_EXPANSION'
  | 'EQUIPMENT_PURCHASE'
  | 'WORKING_CAPITAL'
  | 'AGRICULTURE'
  | 'INNOVATION_RD'
  | 'EXPORT';

export interface NumericRange {
  min?: number;
  max?: number;
  currency?: 'TND' | 'PERCENT' | 'MONTHS';
}

export type RateType =
  | 'FIXED'
  | 'VARIABLE'
  | 'TMM_PLUS_MARGIN'
  | 'NEGOTIATED'
  | 'INTEREST_FREE_SUBSIDIZED'
  | 'UNKNOWN'
  | 'NOT_APPLICABLE';

export interface RateStructure {
  type: RateType;
  value?: number; // e.g. 0.05 for 5%
  margin?: number; // e.g. 0.025 for TMM + 2.5%
  referenceIndex?: string; // e.g. 'TMM'
  min?: number;
  max?: number;
  currency?: 'PERCENT';
  explanation?: LocalizedText;
  evidence?: FieldEvidence;
  ruleStatus?: KnowledgeRuleStatus;
}

export interface FeeStructure {
  id: string;
  name: LocalizedText;
  type: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'VARIABLE_UNKNOWN';
  amount?: number;
  percentage?: number;
  mandatory: boolean;
  evidence?: FieldEvidence;
}

export interface GuaranteeDetails {
  coveragePercentMin?: number;
  coveragePercentMax?: number;
  coverageBasis: 'UNRECOVERABLE_AMOUNT' | 'PRINCIPAL' | 'OTHER' | 'UNKNOWN';
  guaranteeFee?: number;
  feeRuleStatus: KnowledgeRuleStatus;
  eligibleBeneficiaries?: string[];
  governorates?: string[];
}

export interface InsuranceRequirement {
  type: 'DEATH_DISABILITY' | 'PROPERTY_FIRE' | 'ALL_RISKS_VEHICLE' | 'TAKAFUL' | 'OTHER';
  mandatory: boolean;
  description?: LocalizedText;
  estimatedCostRate?: number;
}

export interface GuaranteeRequirement {
  id: string;
  type: 'STATE_GUARANTEE_SOTUGAR' | 'MORTGAGE_HYPOTHEQUE' | 'PLEDGE_GAGE' | 'PERSONAL_SURETY_CAUTION' | 'DIRECT_DEBIT_DELEGATION' | 'NONE';
  description: LocalizedText;
  mandatory: boolean;
}

export interface CollateralRequirement {
  id: string;
  description: LocalizedText;
  required: boolean;
}

export interface RequiredDocument {
  id: string;
  category: 'LEGAL' | 'FINANCIAL' | 'PROJECT_PROFORMA' | 'IDENTITY' | 'PROPERTY_TITLE' | 'TECHNICAL';
  name: LocalizedText;
  description?: LocalizedText;
  mandatory: boolean;
  evidenceStatus?: KnowledgeRuleStatus;
}

export interface ApplicationStep {
  stepNumber: number;
  title: LocalizedText;
  description: LocalizedText;
  estimatedDurationDays?: number;
}

export interface FinancialTerms {
  amount?: NumericRange;
  projectCost?: NumericRange;
  durationMonths?: NumericRange;
  contribution?: NumericRange;
  contributionPercentage?: NumericRange;
  rate?: RateStructure;
  fees?: FeeStructure[];
  insurance?: InsuranceRequirement[];
  gracePeriodMonths?: NumericRange;
  paymentStructure?: 'AMORTIZING_MONTHLY' | 'LEASING_RENTAL' | 'DEFERRED_SEASONAL' | 'SINGLE_BULLET' | 'OTHER';
  guaranteeDetails?: GuaranteeDetails;
  verification: FieldEvidence[];
}

export interface SimulatorInput {
  key: string;
  label: LocalizedText;
  type: 'AMOUNT' | 'DURATION' | 'CONTRIBUTION' | 'VEHICLE_PRICE' | 'PROPERTY_PRICE' | 'INCOME';
  required: boolean;
  defaultValue?: number;
}

export interface SimulatorReference {
  id: string;
  providerId: string;
  productId?: string;
  url: string;
  simulatorType: 'LOAN' | 'MORTGAGE' | 'CAR' | 'LEASING' | 'CONSUMER' | 'OTHER';
  inputs?: SimulatorInput[];
  outputFields?: string[];
  official: boolean;
  notes?: LocalizedText;
  evidence: SourceReference;
}

export interface ApplicabilityRule {
  domains: FinancingDomain[];
  purposes: ProductPurpose[];
  applicantTypes: ApplicantType[];
  assetTypes?: AssetType[];
  requiresBusinessEntity?: boolean;
  allowedSectors?: string[];
  allowedGovernorates?: string[];
  allowedBusinessStages?: string[];
  allowedVehicleConditions?: ('new' | 'used')[];
  allowedPropertyConditions?: ('new' | 'existing')[];
  isFirstPropertyOnly?: boolean;
  requiresHigherEducationDegree?: boolean;
  requiresStartupActLabel?: boolean;
  unverifiedApplicability?: boolean;
  scope?: ApplicabilityScope;
}

export interface FinancingCriterion {
  id: string;
  field: string;
  operator: 'EQ' | 'NEQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'IN' | 'NOT_IN' | 'BETWEEN' | 'REQUIRED' | 'CUSTOM';
  expectedValue?: unknown;
  critical: boolean;
  description: LocalizedText;
  evidence?: FieldEvidence;
  ruleStatus?: KnowledgeRuleStatus;
}

export interface FinancingProduct {
  id: string;
  providerId: string;
  name: LocalizedText;
  shortDescription?: LocalizedText;
  category: FinancingDomain;
  financingDomains: FinancingDomain[];
  financingPurposes: ProductPurpose[];
  applicantTypes: ApplicantType[];
  assetTypes?: AssetType[];
  applicability: ApplicabilityRule;
  criteria: FinancingCriterion[];
  financialTerms: FinancialTerms;
  guarantees?: GuaranteeRequirement[];
  collateral?: CollateralRequirement[];
  requiredDocuments?: RequiredDocument[];
  applicationProcess?: ApplicationStep[];
  simulator?: SimulatorReference;
  verification: ProductVerification;
  sources: SourceReference[];
  status: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN';
  ruleStatus: KnowledgeRuleStatus;
  operationalStatus: OperationalStatus;
  knowledgeVersion: string;
  lastReviewedAt: string;
  claims?: KnowledgeClaim[];
  evidenceMap?: Record<string, RuleEvidence>;
  lastCheckedAt?: string;
}

export interface CatalogueMetadata {
  version: string;
  generatedAt: string;
  lastRefreshAt: string;
  sourceCount: number;
  providerCount: number;
  productCount: number;
  productsRequiringReview: number;
}

export type ExclusionReasonCode =
  | 'PURPOSE_MISMATCH'
  | 'APPLICANT_TYPE_MISMATCH'
  | 'ASSET_MISMATCH'
  | 'GEOGRAPHY_MISMATCH'
  | 'SECTOR_MISMATCH'
  | 'AMOUNT_OUT_OF_RANGE'
  | 'CRITICAL_FAILURE'
  | 'UNKNOWN_APPLICABILITY'
  | 'INSUFFICIENT_DATA'
  | 'PRODUCT_INACTIVE';

export interface ExclusionReason {
  productId: string;
  productName: LocalizedText;
  providerId: string;
  reasonCode: ExclusionReasonCode;
  explanation: LocalizedText;
}

export interface ExtractedFinancingFact {
  field: string;
  value: unknown;
  sourceId: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  excerpt?: string;
  notes?: string;
}

export interface FinancingDiscoveryResult {
  source: SourceReference;
  providerCandidates: string[];
  productCandidates: string[];
  extractedFacts: ExtractedFinancingFact[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  requiresReview: boolean;
}

export interface DiscoveryQuery {
  id: string;
  domain: FinancingDomain;
  queryFr: string;
  queryAr: string;
  description: string;
  targetSources: string[];
}
