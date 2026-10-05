/**
 * Mizen Knowledge Audit Tool
 * Audits canonical financing catalogue against evidence rules, provenance standards, and validity criteria.
 */

import { KNOWLEDGE_REGISTRY } from '../src/knowledge/knowledgeRegistry';
import { CLAIMS_REPOSITORY } from '../src/knowledge/claimsRepository';

console.log('================================================================');
console.log('                 MIZEN KNOWLEDGE AUDIT');
console.log('================================================================\n');

const repo = CLAIMS_REPOSITORY;
const summary = repo.getReconciliationSummary();
const metadata = KNOWLEDGE_REGISTRY.getCatalogueMetadata();
const audit = KNOWLEDGE_REGISTRY.validateKnowledgeIntegrity();

console.log(`Catalogue Version: ${metadata.version}`);
console.log(`Total Active Products: ${metadata.productCount}`);
console.log(`Total Registered Providers: ${metadata.providerCount}`);
console.log(`Indexed Sources: ${metadata.sourceCount}`);
console.log(`\nClaims Statistics:`);
console.log(`- Total Claims in Repository: ${summary.stats.total}`);
console.log(`- Active Current Claims: ${summary.stats.active}`);
console.log(`- Historical / Superseded Claims: ${summary.stats.historical + summary.stats.superseded}`);
console.log(`- Conflicting Claims Requiring Review: ${summary.stats.conflicting}`);

console.log(`\nAudit Integrity Status: ${audit.isValid ? '✅ PASS (Zero Violations)' : '❌ FAIL'}`);
if (audit.violations.length > 0) {
  console.log('\nViolations:');
  audit.violations.forEach(v => console.log(`  - ${v}`));
  process.exit(1);
} else {
  console.log('All provenance, temporal safety, and zero-fabrication invariants verified.');
}
