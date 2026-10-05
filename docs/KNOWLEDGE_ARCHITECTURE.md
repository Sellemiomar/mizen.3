# Mizen — Canonical Financing Knowledge Architecture

> **Authoritative Boundary Rule**:
> *"Production financing knowledge MUST originate from authoritative claims. Legacy catalogues are projections or compatibility layers only and MUST NOT contain independently maintained financing facts."*

---

## 1. Single Authoritative Source of Truth

In Mizen, financing knowledge is not stored as monolithic, mutable product definitions. Instead, the **FinancingClaimsRepository** (`src/knowledge/claimsRepository.ts`) serves as the single source of truth. Every parameter, limit, interest formula, exclusion, exception, and co-financing rule is represented as an independent, source-tracked **claim**.

```
[ Research Ingestion Engine ]
              ↓
[ FinancingClaimsRepository ] (Sole Source of Truth: Active & Historical Claims)
              ↓
[ Live Canonical Projection ] (Dynamic Mapping: No Stale Static Numbers)
              ↓
   [ KnowledgeRegistry ]
              ↓
   [ Matching & Simulation Engine ] → [ User Interface ]
```

---

## 2. Claim Lifecycle & Discrete Representation

Each claim (`FinancingClaim`) possesses its own discrete identity and metadata:
- **`claimId`**: Unique identifier (e.g., `claim_bfpme_cmlt_ceiling_amount_current`).
- **`entityId`**: Target product, provider, or mechanism.
- **`field`**: Specific parameter (e.g., `maxFinancingAmount`, `minProjectCost`, `publishedMarginRange`).
- **`value`**: Machine-readable fact (number, range, boolean, array).
- **`source`**: Full provenance (`url`, `title`, `publisher`, `retrievedAt`, `publishedAt`).
- **`evidenceStrength`**: Source ranking.
- **`ruleStatus`**, **`operationalStatus`**, **`applicabilityStatus`**.
- **`conflictStatus`**: `NONE`, `CONFLICT_DETECTED`, `SUPERSEDED`, `HISTORICAL_DIVERGENCE`.
- **`supersededByClaimId`** / **`supersededReason`**.

---

## 3. Historical vs. Current Knowledge

When research reveals a changed rule:
- **Never Hard-Delete Evidence**: Old claims are preserved for historical auditability and temporal trace.
- **Supersession Pointer**: The old claim is marked `conflictStatus = 'SUPERSEDED'` and points to `supersededByClaimId`.
- **Active Filter**: Runtime projections only query `getActiveClaims()`, which filters for `ruleStatus === 'VERIFIED_CURRENT'` and `conflictStatus !== 'SUPERSEDED'`.

---

## 4. Evidence Strength & Source Precedence

Mizen ranks evidence using strict precedence:
1. **`DIRECT_PRIMARY_CURRENT`** (Rank 5): Official regulation, active decree, official product page.
2. **`DIRECT_PRIMARY_HISTORICAL`** (Rank 4): Official past decree, archived convention.
3. **`OFFICIAL_SECONDARY`** (Rank 3): Official simulator, institutional summary guide.
4. **`SECONDARY`** (Rank 2): Independent press, business plan templates, aggregator articles.
5. **`INFERRED`** (Rank 1): Calculated or heuristic deduction.

---

## 5. Separation of Independent Dimensions

Mizen strictly prevents collapsing distinct operational concepts:
- **Rule Status**: Is the legal rule verified? (`VERIFIED_CURRENT`, `VERIFIED_HISTORICAL`, `PARTIALLY_VERIFIED`, `UNKNOWN`, `OUTDATED`).
- **Operational Status**: Is the mechanism actively accepting applications? (`ACTIVE_CONFIRMED`, `ACTIVE_NOT_CONFIRMED`, `INACTIVE_CONFIRMED`, `HISTORICAL_ONLY`, `UNKNOWN`).
  - *Invariant*: Active institution does **not** imply active product (e.g. SOTUGAR active ≠ FGJC active).
- **Applicability Scope**: Where/how does the rule apply? (`UNIVERSAL`, `CONDITIONAL`, `GEOGRAPHICALLY_CONDITIONAL`, `ENTITY_SPECIFIC`).
- **Fund Capitalization vs. Borrower Ceiling**: Fund allocations (e.g., FGPME 75/90: 30 MDT) are explicitly tagged with `isFundLevelFact: true` and are **never** normalized into entrepreneur borrowing ceilings.

---

## 6. Conflict-Aware Research Ingestion

The `ResearchImportEngine` (`src/knowledge/researchImport.ts`) enforces:
- **Idempotency**: Re-importing identical claim batches produces 0 duplicate records and 0 confidence degradation.
- **Precedence Protection**:
  - `DIRECT_PRIMARY_CURRENT` can supersede stale/weaker claims.
  - `DIRECT_PRIMARY_HISTORICAL` cannot supersede `DIRECT_PRIMARY_CURRENT`.
  - `SECONDARY` or `INFERRED` sources cannot overwrite primary verified claims.
  - Equal-rank contradicting claims trigger `CONFLICT_DETECTED` and preserve both for manual review.

---

## 7. Canonical Live Projection Layer

`src/knowledge/canonicalCatalogue.ts` contains **zero** hardcoded, independently maintained financing figures. It acts as a pure, dynamic proxy over `KNOWLEDGE_REGISTRY.getProducts()` and `KNOWLEDGE_REGISTRY.getProviders()`.
Any claim updated in `CLAIMS_REPOSITORY` immediately and automatically updates the projection throughout the application.

---

## 8. Matching & Eligibility Safety

The matching engine classifies outcomes into 4 explicit states:
- `VERIFIED_ELIGIBLE`: All critical criteria satisfied by verified current evidence.
- `POTENTIALLY_ELIGIBLE`: Alignment observed, non-critical items need review.
- `UNKNOWN_DUE_TO_MISSING_DATA`: Missing applicant profile data or unverified product operational status. Missing data **never** becomes a false rejection or false pass.
- `INCOMPATIBLE_ON_DOCUMENTED_RULES`: Hard boundary violation (e.g., project cost < 150k TND or > 15M TND for BFPME CMLT, or sector exclusion with no applicable exception).

---

## 9. Calculation Safety

Payment and cost estimations (`src/engine/financialCalculations.ts`) adhere to zero-fabrication rules:
- If a rate is variable without an established universal automatic link (e.g., BFPME 2–4.5% published margin with unconfirmed TMM linkage), `canCalculateReliably` is `false` and `monthlyPayment` is `undefined`.
- Unresolved terms like *"financement intégral possible"* return `UNKNOWN_DUE_TO_MISSING_DATA` and do not calculate 100% bank financing.
- Guarantee mechanisms (SOTUGAR) are classified as credit-enhancement instruments with `rateType: 'NOT_APPLICABLE'` and never generate direct loan amortization schedules.

---

## 10. Continuous CI Knowledge Audit

`KNOWLEDGE_REGISTRY.validateKnowledgeIntegrity()` runs in automated test suites (`scripts/test-scenarios.ts` - Scenario Z & Phase 10) to fail CI if:
1. Any claim lacks source provenance or evidence strength.
2. Any historical claim leaks into active product definitions.
3. Any fund capitalization is exposed as a borrower ceiling.
4. Any published rate range is collapsed into an arbitrary single rate.
5. Any mechanism compatibility is asserted without empirical source backing.
