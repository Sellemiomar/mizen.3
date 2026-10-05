/**
 * Mizen - Financing Stack Domain Model
 * 
 * Formalizes co-financing structures, stacking layers, and risk enhancement.
 * Enforces strict separation between Cash Financing, Grants, Equity, Leasing, and Guarantees.
 */

import { FinancingProgram, Provider, Language } from './financing';
import { CompatibilityStatus } from './claims';

export type FinancingStackLayerType =
  | 'USER_EQUITY'
  | 'GRANT'
  | 'QUASI_EQUITY'
  | 'SENIOR_DEBT'
  | 'LEASING'
  | 'ISLAMIC_FINANCE'
  | 'GUARANTEE'
  | 'OTHER_SUPPORT';

export type StackFeasibilityStatus =
  | 'SUPPORTED'
  | 'POTENTIALLY_COMPATIBLE'
  | 'UNKNOWN_COMPATIBILITY'
  | 'INCOMPATIBLE';

export interface StackLayerItem {
  id: string;
  program: FinancingProgram;
  provider: Provider;
  layerType: FinancingStackLayerType;
  isCashContribution: boolean; // True for loans, grants, equity, leasing. False for guarantees!
  allocatedAmount?: number;
  percentageOfProjectCost?: number;
  guaranteedTargetProgramId?: string; // If this is a guarantee, which debt product does it cover?
  guaranteeCoveragePercentage?: number; // e.g. 75% coverage of unrecoverable debt
  status: 'VERIFIED_CURRENT' | 'VERIFIED_HISTORICAL' | 'PARTIALLY_VERIFIED' | 'UNKNOWN';
  notes: {
    fr: string;
    ar: string;
  };
}

export interface FinancingStackOption {
  id: string;
  title: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  feasibility: StackFeasibilityStatus;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  layers: StackLayerItem[];
  
  // Financial Summary Breakdown
  totalProjectCost: number;
  userContribution: number;
  grantAmount: number;
  quasiEquityAmount: number;
  debtAndLeasingAmount: number;
  totalCashFinancingCovered: number;
  uncoveredFinancingGap: number;
  
  // Guarantee Support (Separate from Cash)
  guaranteesAttached: Array<{
    guaranteeProgramId: string;
    guaranteeName: string;
    coversDebtId: string;
    coveragePct: number;
    notes: { fr: string; ar: string };
  }>;

  compatibilitySummary: {
    fr: string;
    ar: string;
  };
  warnings: Array<{
    fr: string;
    ar: string;
  }>;
}
