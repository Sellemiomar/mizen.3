/**
 * Mizen - Conflict-Aware Research Ingestion Engine
 * 
 * Safely imports new financing research into the claims repository without
 * silently overwriting historical evidence or allowing weak/secondary facts
 * to corrupt verified primary knowledge.
 */

import { 
  FinancingClaim, 
  CompatibilityClaim, 
  EvidenceStrength, 
  ClaimReconciliationResult
} from '../types/claims';
import { FinancingClaimsRepository } from './claimsRepository';

export const EVIDENCE_RANKING: Record<EvidenceStrength, number> = {
  DIRECT_PRIMARY_CURRENT: 5,
  DIRECT_PRIMARY_HISTORICAL: 4,
  OFFICIAL_SECONDARY: 3,
  SECONDARY: 2,
  INFERRED: 1
};

export interface ResearchImportBatch {
  batchId: string;
  importedAt: string;
  sourceDescription: string;
  claims: FinancingClaim[];
  compatibilities?: CompatibilityClaim[];
}

export interface ResearchImportOutcome {
  batchId: string;
  importedAt: string;
  acceptedClaims: number;
  supersededClaims: number;
  conflictedClaims: number;
  skippedIdentical: number;
  summary: ClaimReconciliationResult;
  issues: Array<{
    claimId: string;
    entityId: string;
    field: string;
    type: 'CONFLICT_DETECTED' | 'LOWER_PRECEDENCE_IGNORED' | 'HISTORICAL_PRESERVED' | 'UNRESOLVED_DATA';
    message: string;
  }>;
}

export class ResearchImportEngine {
  constructor(private repo: FinancingClaimsRepository) {}

  /**
   * Ingests a new research batch with strict conflict and precedence enforcement.
   */
  public importBatch(batch: ResearchImportBatch): ResearchImportOutcome {
    let acceptedClaims = 0;
    let supersededClaims = 0;
    let conflictedClaims = 0;
    let skippedIdentical = 0;
    const issues: ResearchImportOutcome['issues'] = [];

    for (const incoming of batch.claims) {
      const existingSameId = this.repo.getClaim(incoming.claimId);
      
      // 1. Idempotency Check: exact same claim ID and content
      if (existingSameId) {
        if (
          existingSameId.value === incoming.value &&
          existingSameId.ruleStatus === incoming.ruleStatus &&
          existingSameId.operationalStatus === incoming.operationalStatus &&
          existingSameId.evidenceStrength === incoming.evidenceStrength
        ) {
          skippedIdentical++;
          continue;
        }
      }

      // 2. Find existing claims for the same entity and field
      const existingEntityFieldClaims = this.repo
        .getAllClaims(incoming.entityId)
        .filter(c => c.field === incoming.field && c.claimId !== incoming.claimId);

      let shouldInsertIncoming = true;
      let incomingClaimToStore: FinancingClaim = { ...incoming };

      for (const existing of existingEntityFieldClaims) {
        // Skip already superseded claims
        if (existing.conflictStatus === 'SUPERSEDED') continue;

        const incomingRank = EVIDENCE_RANKING[incoming.evidenceStrength] || 1;
        const existingRank = EVIDENCE_RANKING[existing.evidenceStrength] || 1;

        // CASE A: Incoming is stronger CURRENT PRIMARY and current claim is older/weaker
        if (
          incoming.evidenceStrength === 'DIRECT_PRIMARY_CURRENT' &&
          incoming.ruleStatus === 'VERIFIED_CURRENT' &&
          (existingRank < incomingRank || existing.ruleStatus === 'VERIFIED_HISTORICAL' || existing.ruleStatus === 'OUTDATED')
        ) {
          // Supersede the existing claim
          existing.conflictStatus = 'SUPERSEDED';
          existing.supersededByClaimId = incoming.claimId;
          existing.supersededReason = `Mis à jour par la revendication ${incoming.claimId} (${incoming.source.title})`;
          supersededClaims++;
          continue;
        }

        // CASE B: Incoming is HISTORICAL PRIMARY and existing is CURRENT PRIMARY
        if (
          incoming.evidenceStrength === 'DIRECT_PRIMARY_HISTORICAL' &&
          existing.evidenceStrength === 'DIRECT_PRIMARY_CURRENT' &&
          existing.ruleStatus === 'VERIFIED_CURRENT'
        ) {
          // Historical cannot overwrite current verified
          incomingClaimToStore.conflictStatus = 'HISTORICAL_DIVERGENCE';
          incomingClaimToStore.ruleStatus = 'VERIFIED_HISTORICAL';
          incomingClaimToStore.operationalStatus = 'HISTORICAL_ONLY';
          issues.push({
            claimId: incoming.claimId,
            entityId: incoming.entityId,
            field: incoming.field,
            type: 'HISTORICAL_PRESERVED',
            message: `Revendication historique ${incoming.claimId} conservée sans écraser la règle actuelle vérifiée ${existing.claimId}.`
          });
          continue;
        }

        // CASE C: Incoming is WEAKER (e.g. SECONDARY/INFERRED) than existing (DIRECT_PRIMARY)
        if (incomingRank < existingRank) {
          incomingClaimToStore.conflictStatus = 'CONFLICT_DETECTED';
          conflictedClaims++;
          issues.push({
            claimId: incoming.claimId,
            entityId: incoming.entityId,
            field: incoming.field,
            type: 'LOWER_PRECEDENCE_IGNORED',
            message: `Source secondaire/faible ${incoming.claimId} (${incoming.evidenceStrength}) ne peut pas écraser la source primaire ${existing.claimId} (${existing.evidenceStrength}).`
          });
          continue;
        }

        // CASE D: EQUAL RANK with CONTRADICTING VALUES (and not superseding)
        if (incomingRank === existingRank && JSON.stringify(incoming.value) !== JSON.stringify(existing.value)) {
          incomingClaimToStore.conflictStatus = 'CONFLICT_DETECTED';
          existing.conflictStatus = 'CONFLICT_DETECTED';
          conflictedClaims++;
          issues.push({
            claimId: incoming.claimId,
            entityId: incoming.entityId,
            field: incoming.field,
            type: 'CONFLICT_DETECTED',
            message: `Conflit détecté entre ${incoming.claimId} et ${existing.claimId} de rang identique sans règle de précédence temporelle explicite.`
          });
        }
      }

      if (shouldInsertIncoming) {
        this.repo.ingestClaims([incomingClaimToStore]);
        acceptedClaims++;
      }
    }

    if (batch.compatibilities && batch.compatibilities.length > 0) {
      batch.compatibilities.forEach(c => {
        this.repo.ingestCompatibility(c);
      });
    }

    return {
      batchId: batch.batchId,
      importedAt: batch.importedAt,
      acceptedClaims,
      supersededClaims,
      conflictedClaims,
      skippedIdentical,
      summary: this.repo.getReconciliationSummary(),
      issues
    };
  }
}
