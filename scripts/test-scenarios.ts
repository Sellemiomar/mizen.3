import { runMatchingEngine } from '../src/engine/matchingEngine';
import { calculateFinancingCost } from '../src/engine/financialCalculations';
import { FINANCING_PROGRAMS } from '../src/data/financingData';
import { ApplicantProfile } from '../src/types/financing';
import { parseTextToProfileFallback } from '../src/utils/intakeParser';

console.log('================================================================');
console.log('       MIZEN PRODUCTION INTEGRITY AUDIT SUITE (SCENARIOS A-J)    ');
console.log('================================================================\n');

let allPassed = true;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    allPassed = false;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// Scenario A: Young graduate, first project, 75,000 DT in Sousse
// -------------------------------------------------------------
console.log('--- SCENARIO A: Jeune diplômé, 75 000 DT à Sousse ---');
const profileA: ApplicantProfile = {
  totalProjectCost: 100000,
  userContribution: 25000,
  financingRequested: 75000,
  purpose: 'equipment',
  sector: 'industry',
  location: 'Sousse',
  businessStage: 'idea_project',
  legalStructure: 'suarl',
  hasHigherEducationDegree: true,
  hasStartupActLabel: false,
  isRegionalDevelopmentZone: false,
  structurePreference: 'any'
};

const resultsA = runMatchingEngine(profileA);
assert(resultsA.length > 0, 'Scenario A matches programs');
const btsDiplomesA = resultsA.find(r => r.program.id === 'bts_diplomes');
assert(btsDiplomesA !== undefined, 'BTS Diplômés is evaluated');
assert(btsDiplomesA?.reasons.alignmentLevel === 'strong_alignment', 'BTS Diplômés has strong alignment for graduate with 75k DT');
assert(Boolean(btsDiplomesA?.reasons.matchedBecause.some(m => m.fr.includes('Diplôme'))), 'Validates higher education degree');

// -------------------------------------------------------------
// Scenario B: Existing company, 250,000 DT extension in Sfax (Manufacturing)
// -------------------------------------------------------------
console.log('\n--- SCENARIO B: Entreprise existante, 250 000 DT à Sfax ---');
const profileB: ApplicantProfile = {
  totalProjectCost: 350000,
  userContribution: 100000,
  financingRequested: 250000,
  purpose: 'expansion',
  sector: 'industry',
  location: 'Sfax',
  businessStage: 'established_over_2y',
  legalStructure: 'sarl',
  hasHigherEducationDegree: true,
  hasStartupActLabel: false,
  isRegionalDevelopmentZone: false,
  structurePreference: 'standard'
};

const resultsB = runMatchingEngine(profileB);
const bfpmeB = resultsB.find(r => r.program.id === 'bfpme_creation');
const sotugarB = resultsB.find(r => r.program.id === 'sotugar_guarantee');
assert(bfpmeB !== undefined && bfpmeB.reasons.alignmentLevel === 'strong_alignment', 'BFPME matches 250k DT PME expansion with strong alignment');
assert(sotugarB !== undefined && sotugarB.reasons.alignmentLevel === 'strong_alignment', 'SOTUGAR matches investment guarantee with strong alignment');
// BTS cap is 150k DT, so 250k DT exceeds it
const btsB = resultsB.find(r => r.program.id === 'bts_diplomes');
assert(Boolean(btsB?.reasons.potentialIssues.some(p => p.fr.includes('dépasse le plafond'))), 'BTS flags amount exceeding cap');

// -------------------------------------------------------------
// Scenario C: Innovative startup, 50,000 DT R&D/Tech in Tunis
// -------------------------------------------------------------
console.log('\n--- SCENARIO C: Startup innovante R&D, 50 000 DT à Tunis ---');
const profileC: ApplicantProfile = {
  totalProjectCost: 60000,
  userContribution: 10000,
  financingRequested: 50000,
  purpose: 'innovation_rd',
  sector: 'ict_tech',
  location: 'Tunis',
  businessStage: 'creation_underway',
  legalStructure: 'suarl',
  hasHigherEducationDegree: true,
  hasStartupActLabel: true,
  isRegionalDevelopmentZone: false,
  structurePreference: 'any'
};

const resultsC = runMatchingEngine(profileC);
const startupActC = resultsC.find(r => r.program.id === 'startup_act_bourse');
assert(startupActC !== undefined, 'Startup Act program evaluated');
assert(startupActC?.reasons.alignmentLevel === 'strong_alignment', 'Startup Act matches labeled innovative startup with strong alignment');
assert(Boolean(startupActC?.reasons.matchedBecause.some(m => m.fr.includes('Startup Act'))), 'Confirms Startup Act label recognized');

// -------------------------------------------------------------
// Scenario D: Micro-project / artisan, 15,000 DT in Kairouan
// -------------------------------------------------------------
console.log('\n--- SCENARIO D: Micro-projet artisan, 15 000 DT à Kairouan ---');
const profileD: ApplicantProfile = {
  totalProjectCost: 18000,
  userContribution: 3000,
  financingRequested: 15000,
  purpose: 'working_capital',
  sector: 'crafts_trades',
  location: 'Kairouan',
  businessStage: 'idea_project',
  legalStructure: 'not_yet_created',
  hasHigherEducationDegree: false,
  hasStartupActLabel: false,
  isRegionalDevelopmentZone: true,
  structurePreference: 'any'
};

const resultsD = runMatchingEngine(profileD);
const fonapramD = resultsD.find(r => r.program.id === 'bts_fonapram');
const endaD = resultsD.find(r => r.program.id === 'enda_microcredit_equip');
assert(fonapramD !== undefined, 'FONAPRAM matches small craft project');
assert(endaD !== undefined, 'Enda Tamweel matches micro-financing');

// -------------------------------------------------------------
// Scenario E: Islamic finance preference, 80,000 DT equipment in Gabes
// -------------------------------------------------------------
console.log('\n--- SCENARIO E: Finance islamique, 80 000 DT à Gabès ---');
const profileE: ApplicantProfile = {
  totalProjectCost: 100000,
  userContribution: 20000,
  financingRequested: 80000,
  purpose: 'equipment',
  sector: 'industry',
  location: 'Gabes',
  businessStage: 'idea_project',
  legalStructure: 'suarl',
  hasHigherEducationDegree: true,
  hasStartupActLabel: false,
  isRegionalDevelopmentZone: true,
  structurePreference: 'islamic'
};

const resultsE = runMatchingEngine(profileE);
const zitounaE = resultsE.find(r => r.program.id === 'banque_zitouna_mourabaha');
assert(zitounaE !== undefined && zitounaE.reasons.alignmentLevel === 'strong_alignment', 'Banque Zitouna Mourabaha matches Islamic finance preference with strong alignment');
assert(zitounaE?.costEstimate.canCalculateReliably === false, 'Mourabaha does not fabricate a 9.5% fake quote');
assert(zitounaE?.costEstimate.rateOrigin === 'unavailable', 'Mourabaha rateOrigin is unavailable/contractual');

// -------------------------------------------------------------
// Scenario F: Minimal / Empty profile with missing/undefined info
// -------------------------------------------------------------
console.log('\n--- SCENARIO F: Profil minimal / données inconnues ---');
const profileF: ApplicantProfile = {
  totalProjectCost: undefined,
  userContribution: undefined,
  financingRequested: undefined,
  purpose: undefined,
  sector: undefined,
  location: undefined,
  businessStage: undefined,
  legalStructure: undefined,
  hasHigherEducationDegree: undefined,
  hasStartupActLabel: undefined,
  isRegionalDevelopmentZone: false,
  structurePreference: 'any'
};

const resultsF = runMatchingEngine(profileF);
assert(resultsF.length > 0, 'Scenario F evaluates all programs without throwing');
for (const res of resultsF) {
  // Missing info must become needsVerification, NOT an unjustified outright rejection
  assert(res.reasons.needsVerification.length > 0, `Program ${res.program.id} marks missing items as needsVerification`);
  // Must not fabricate fake monthly repayment or fake costs
  assert(res.costEstimate.canCalculateReliably === false, `Program ${res.program.id} does not calculate fake costs for undefined amount`);
  assert(res.costEstimate.monthlyPayment === undefined, `Program ${res.program.id} monthlyPayment is undefined when amount missing`);
  assert(
    ['strong_alignment', 'partial_alignment', 'potential_blockers'].includes(res.reasons.alignmentLevel),
    `Program ${res.program.id} outputs valid alignmentLevel`
  );
}

// -------------------------------------------------------------
// Scenario G: Distinct financingRequested vs totalProjectCost Truth Model
// -------------------------------------------------------------
console.log('\n--- SCENARIO G: Séparation stricte financingRequested ≠ totalProjectCost ---');
const profileG: ApplicantProfile = {
  financingRequested: 40000,
  totalProjectCost: undefined, // Total cost deliberately missing
  userContribution: undefined,
  purpose: 'equipment',
  sector: 'services',
  location: 'Tunis',
  businessStage: 'creation_underway',
  hasHigherEducationDegree: true,
  structurePreference: 'any'
};
const resultsG = runMatchingEngine(profileG);
const btsG = resultsG.find(r => r.program.id === 'bts_diplomes');
assert(btsG !== undefined, 'BTS evaluated in Scenario G');
assert(
  Boolean(btsG?.reasons.needsVerification.some(v => v.fr.includes('apport') || v.fr.includes('Coût total non spécifié'))),
  'Engine requires verification of project cost and NEVER equates financingRequested to totalProjectCost'
);

// -------------------------------------------------------------
// Scenario H: Dynamic Verification Coverage & Integrity Audit
// -------------------------------------------------------------
console.log('\n--- SCENARIO H: Audit de couverture et sémantique dynamique des statuts ---');
const validStatuses = ['VERIFIED', 'PARTIALLY_VERIFIED', 'OUTDATED', 'UNVERIFIED', 'SOURCE_UNAVAILABLE'];

for (const prog of FINANCING_PROGRAMS) {
  const v = prog.verification;
  assert(v !== undefined, `${prog.id} has verification metadata`);
  assert(validStatuses.includes(v.status), `${prog.id} has a recognized verification status: ${v.status}`);
  assert(Array.isArray(v.verifiedFields), `${prog.id} specifies verified fields array`);
  assert(Array.isArray(v.unverifiedFields), `${prog.id} specifies unverified fields array`);
  assert(v.sourceUrl.length > 0, `${prog.id} has official source URL`);
  assert(v.sourceTitle.length > 0, `${prog.id} has official source Title`);
  assert(Boolean(v.dateChecked), `${prog.id} has checked date`);

  // Disjoint sets check (no field is simultaneously verified and unverified)
  const overlap = v.verifiedFields.filter(f => v.unverifiedFields.includes(f));
  assert(overlap.length === 0, `${prog.id} has no conflicting overlap between verified and unverified fields`);

  // Semantic status validation
  if (v.status === 'VERIFIED') {
    assert(v.unverifiedFields.length === 0, `${prog.id} marked VERIFIED has no unverified fields`);
    assert(v.verifiedFields.length > 0, `${prog.id} marked VERIFIED has verified fields documented`);
  } else if (v.status === 'PARTIALLY_VERIFIED') {
    assert(v.verifiedFields.length > 0, `${prog.id} marked PARTIALLY_VERIFIED has at least one verified field`);
    assert(v.unverifiedFields.length > 0, `${prog.id} marked PARTIALLY_VERIFIED has at least one unverified field`);
  } else if (v.status === 'UNVERIFIED') {
    assert(v.verifiedFields.length === 0, `${prog.id} marked UNVERIFIED has no verified fields claimed`);
  }
}

// -------------------------------------------------------------
// Scenario I: Unsupported rates never become quotes audit
// -------------------------------------------------------------
console.log('\n--- SCENARIO I: Taux non vérifiés ou variables ne deviennent jamais des devis ---');
// 1. Variable TMM (BFPME)
const bfpmeProg = FINANCING_PROGRAMS.find(p => p.id === 'bfpme_creation')!;
const bfpmeCost = calculateFinancingCost(100000, bfpmeProg);
assert(bfpmeCost.canCalculateReliably === false, 'Variable TMM does not fabricate a fixed quote');
assert(bfpmeCost.monthlyPayment === undefined, 'Variable TMM monthlyPayment is undefined');
assert(bfpmeCost.rateOrigin === 'unavailable', 'Variable TMM rate origin is unavailable');

// 2. Microcredit (Enda Tamweel)
const endaProg = FINANCING_PROGRAMS.find(p => p.id === 'enda_microcredit_equip')!;
const endaCost = calculateFinancingCost(10000, endaProg);
assert(endaCost.canCalculateReliably === false, 'Microcredit does not fabricate a fixed 18% quote');
assert(endaCost.monthlyPayment === undefined, 'Microcredit monthlyPayment is undefined');
assert(endaCost.rateOrigin === 'unavailable', 'Microcredit rate origin is unavailable');

// 3. Islamic finance (Zitouna Mourabaha)
const zitounaProg = FINANCING_PROGRAMS.find(p => p.id === 'banque_zitouna_mourabaha')!;
const zitounaCost = calculateFinancingCost(50000, zitounaProg);
assert(zitounaCost.canCalculateReliably === false, 'Islamic finance does not fabricate an interest-based quote');
assert(zitounaCost.monthlyPayment === undefined, 'Islamic finance monthlyPayment is undefined');
assert(zitounaCost.rateOrigin === 'unavailable', 'Islamic finance rate origin is unavailable');

// -------------------------------------------------------------
// Scenario J: AI Fallback Parser - Zero Fabricated Defaults Audit
// -------------------------------------------------------------
console.log('\n--- SCENARIO J: Audit du parser intake (Zéro invention de données) ---');
// Case 1: Minimal text with only an amount mentioned
const parsedOnlyAmount = parseTextToProfileFallback('J’ai besoin de 30 000 DT pour mon projet.');
assert(parsedOnlyAmount.financingRequested === 30000, 'Parsed 30 000 DT correctly');
assert(parsedOnlyAmount.totalProjectCost === undefined, 'totalProjectCost is NOT fabricated');
assert(parsedOnlyAmount.userContribution === undefined, 'userContribution is NOT fabricated');
assert(parsedOnlyAmount.location === undefined, 'Location is NOT fabricated to Tunis');
assert(parsedOnlyAmount.sector === undefined, 'Sector is NOT fabricated to services');
assert(parsedOnlyAmount.legalStructure === undefined, 'Legal structure is NOT fabricated to suarl');
assert(parsedOnlyAmount.hasHigherEducationDegree === undefined, 'Degree is NOT fabricated');
assert(parsedOnlyAmount.hasStartupActLabel === undefined, 'Startup Act label is NOT fabricated');

// Case 2: Explicit location and sector mentioned
const parsedFull = parseTextToProfileFallback('Mon projet de textile à Monastir nécessite 80 000 DT de matériel.');
assert(parsedFull.financingRequested === 80000, 'Parsed 80 000 DT');
assert(parsedFull.location === 'Monastir', 'Extracted explicit Monastir');
assert(parsedFull.sector === 'industry', 'Extracted explicit textile industry');
assert(parsedFull.purpose === 'equipment', 'Extracted explicit equipment purpose');
assert(parsedFull.hasHigherEducationDegree === undefined, 'Degree remains undefined when unmentioned');

console.log('\n================================================================');
if (allPassed) {
  console.log('🎉 ALL 10 SCENARIOS AND PRODUCTION INTEGRITY CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME CHECKS FAILED');
  process.exit(1);
}
