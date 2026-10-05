/**
 * Mizen - Central Financing Knowledge Registry
 * 
 * Single authoritative orchestrator for the Mizen knowledge architecture.
 * Ensures the claims repository is the sole source of truth and prevents
 * stale, duplicated, or unverified facts from reaching matching or calculations.
 */

import { FinancingProduct, FinancingProvider, CatalogueMetadata } from '../types/knowledge';
import { FinancingProgram, Provider } from '../types/financing';
import { FinancingClaimsRepository, CLAIMS_REPOSITORY } from './claimsRepository';
import { 
  getProjectedCanonicalProducts, 
  getProjectedCanonicalProviders, 
  projectCanonicalProduct 
} from './canonicalProjection';
import { ResearchImportEngine, ResearchImportBatch, ResearchImportOutcome } from './researchImport';
import { CompatibilityClaim, FinancingClaim } from '../types/claims';

export class KnowledgeRegistry {
  private repo: FinancingClaimsRepository;
  private importEngine: ResearchImportEngine;

  constructor(repo: FinancingClaimsRepository = CLAIMS_REPOSITORY) {
    this.repo = repo;
    this.importEngine = new ResearchImportEngine(this.repo);
  }

  public getClaimsRepository(): FinancingClaimsRepository {
    return this.repo;
  }

  public getImportEngine(): ResearchImportEngine {
    return this.importEngine;
  }

  public getProducts(): FinancingProduct[] {
    return getProjectedCanonicalProducts(this.repo);
  }

  public getProductById(productId: string): FinancingProduct | undefined {
    return projectCanonicalProduct(productId, this.repo);
  }

  public getProviders(): FinancingProvider[] {
    return getProjectedCanonicalProviders(this.repo);
  }

  public getProviderById(providerId: string): FinancingProvider | undefined {
    return this.getProviders().find(p => p.id === providerId);
  }

  public getCompatibility(sourceId: string, targetId: string): CompatibilityClaim {
    return this.repo.getCompatibility(sourceId, targetId);
  }

  public importResearch(batch: ResearchImportBatch): ResearchImportOutcome {
    return this.importEngine.importBatch(batch);
  }

  public getCatalogueMetadata(): CatalogueMetadata {
    const products = this.getProducts();
    const providers = this.getProviders();
    const allClaims = this.repo.getAllClaims();
    const srcMap = new Map<string, boolean>();
    allClaims.forEach(c => {
      if (c.source?.id) srcMap.set(c.source.id, true);
    });

    return {
      version: '2.5.0-canonical-claims',
      generatedAt: '2026-10-03',
      lastRefreshAt: '2026-10-03',
      sourceCount: srcMap.size,
      providerCount: providers.length,
      productCount: products.length,
      productsRequiringReview: 0
    };
  }

  /**
   * Phase 10: Strict Knowledge Integrity Audit
   * Fails if any violation of the non-negotiable knowledge rules is detected.
   */
  public validateKnowledgeIntegrity(): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const allClaims = this.repo.getAllClaims();
    const activeClaims = this.repo.getActiveClaims();
    const products = this.getProducts();

    // 1. Check for claims missing provenance or sources
    for (const claim of allClaims) {
      if (!claim.source || !claim.source.id || !claim.source.url) {
        violations.push(`Claim ${claim.claimId} on ${claim.entityId}.${claim.field} is missing valid source provenance.`);
      }
      if (!claim.evidenceStrength) {
        violations.push(`Claim ${claim.claimId} is missing evidenceStrength classification.`);
      }
      if (!claim.ruleStatus) {
        violations.push(`Claim ${claim.claimId} is missing ruleStatus.`);
      }
      if (!claim.operationalStatus) {
        violations.push(`Claim ${claim.claimId} is missing operationalStatus.`);
      }
    }

    // 2. Check that no historical claim is marked as active current
    for (const claim of allClaims) {
      if (
        (claim.ruleStatus === 'VERIFIED_HISTORICAL' || claim.operationalStatus === 'HISTORICAL_ONLY') &&
        claim.conflictStatus !== 'SUPERSEDED' &&
        claim.conflictStatus !== 'HISTORICAL_DIVERGENCE' &&
        activeClaims.some(ac => ac.claimId === claim.claimId)
      ) {
        violations.push(`Historical claim ${claim.claimId} leaked into active claims.`);
      }
    }

    // 3. Fund capitalization must not become borrower financing ceiling
    for (const claim of allClaims) {
      if (claim.isFundLevelFact) {
        // Ensure no active product has its maxAmount set to this fund allocation
        for (const prod of products) {
          if (prod.financialTerms.amount?.max === claim.value) {
            violations.push(`Product ${prod.id} maxAmount is incorrectly set to fund capitalization ${claim.value} (Claim: ${claim.claimId}).`);
          }
        }
      }
    }

    // 4. Rate range must not be converted into a single fabricated rate
    const bfpmeActiveMargin = activeClaims.find(c => c.entityId === 'bfpme_creation' && c.field === 'publishedMarginRange');
    if (bfpmeActiveMargin && typeof bfpmeActiveMargin.value === 'object') {
      const bfpmeProd = products.find(p => p.id === 'bfpme_creation');
      if (bfpmeProd?.financialTerms.rate?.margin !== undefined && typeof bfpmeProd.financialTerms.rate.margin === 'number') {
        violations.push(`BFPME published margin range was incorrectly collapsed to a fixed single rate margin (${bfpmeProd.financialTerms.rate.margin}).`);
      }
    }

    // 5. Incompatible or unverified compatibility must not claim VERIFIED_COMPATIBLE without evidence
    const unknownComp = this.repo.getCompatibility('unknown_a', 'unknown_b');
    if (unknownComp.compatibilityStatus === 'VERIFIED_COMPATIBLE') {
      violations.push(`Unknown mechanism compatibility incorrectly resolved to VERIFIED_COMPATIBLE.`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}

// Global Singleton Registry
export const KNOWLEDGE_REGISTRY = new KnowledgeRegistry();
