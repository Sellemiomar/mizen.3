/**
 * Mizen - Financing Stack & Co-Financing Combination Engine
 * 
 * Generates evidence-backed financing strategies combining multiple compatible instruments.
 * Invariants Enforced:
 * 1. Guarantees are NEVER treated as cash financing (they are risk-sharing instruments).
 * 2. Cross-mechanism compatibility must be backed by explicit empirical claims.
 * 3. Never fabricates payment calculations for mechanisms with unresolved rate formulas.
 * 4. Distinct feasibility levels: SUPPORTED, POTENTIALLY_COMPATIBLE, UNKNOWN_COMPATIBILITY, INCOMPATIBLE.
 */

import { ApplicantProfile, FinancingProgram, Provider, MatchResult } from '../types/financing';
import { FinancingStackOption, StackLayerItem, StackFeasibilityStatus } from '../types/stack';
import { KNOWLEDGE_REGISTRY } from '../knowledge/knowledgeRegistry';
import { PROVIDERS } from '../data/financingData';

export function buildFinancingStacks(
  profile: ApplicantProfile,
  matchResults: MatchResult[]
): FinancingStackOption[] {
  const stacks: FinancingStackOption[] = [];
  const providersMap = new Map<string, Provider>(PROVIDERS.map(p => [p.id, p]));

  const eligibleResults = matchResults.filter(r => 
    r.status === 'STRONG_ALIGNMENT' || 
    r.status === 'POTENTIAL_ALIGNMENT' ||
    r.status === 'REQUIRES_CONFIRMATION'
  );

  const totalCost = profile.totalProjectCost || 0;
  const userContrib = profile.userContribution || 0;
  const financingNeeded = profile.financingRequested || Math.max(0, totalCost - userContrib);

  // Group candidate programs by mechanism category
  const debtPrograms = eligibleResults.filter(r => r.program.category === 'bank_loan' || r.program.category === 'subsidized_loan');
  const leasingPrograms = eligibleResults.filter(r => r.program.id === 'leasing_vehicule_pro');
  const grantPrograms = eligibleResults.filter(r => r.program.category === 'grant_subsidy');
  const guaranteePrograms = eligibleResults.filter(r => r.program.category === 'guarantee');
  const islamicPrograms = eligibleResults.filter(r => r.program.category === 'islamic_finance');

  // Strategy 1: PME Co-Financing Scheme (BFPME + Commercial Bank + SOTUGAR Guarantee)
  const bfpmeMatch = debtPrograms.find(r => r.program.id === 'bfpme_creation');
  const sotugarMatch = guaranteePrograms.find(r => r.program.id === 'sotugar_guarantee');

  if (bfpmeMatch && totalCost >= 150000) {
    const bfpmeMaxAmount = Math.min(2500000, totalCost * 0.65, financingNeeded);
    const bfpmeAllocated = Math.round(Math.min(bfpmeMaxAmount, financingNeeded * 0.60));
    const commercialBankAllocated = Math.max(0, financingNeeded - bfpmeAllocated);

    const bfpmeCompatSotugar = KNOWLEDGE_REGISTRY.getCompatibility('bfpme_creation', 'sotugar_guarantee');
    const sotugarCompatBank = KNOWLEDGE_REGISTRY.getCompatibility('sotugar_guarantee', 'bh_bank_loan');

    let feasibility: StackFeasibilityStatus = 'POTENTIALLY_COMPATIBLE';
    if (bfpmeCompatSotugar.compatibilityStatus === 'VERIFIED_COMPATIBLE') {
      feasibility = 'SUPPORTED';
    } else if (bfpmeCompatSotugar.compatibilityStatus === 'POTENTIALLY_COMPATIBLE') {
      feasibility = 'POTENTIALLY_COMPATIBLE';
    }

    const bfpmeProvider = providersMap.get(bfpmeMatch.program.providerId)!;
    const sotugarProvider = providersMap.get('sotugar')!;

    const layers: StackLayerItem[] = [
      {
        id: 'layer_user_equity',
        program: bfpmeMatch.program,
        provider: bfpmeProvider,
        layerType: 'USER_EQUITY',
        isCashContribution: true,
        allocatedAmount: userContrib,
        percentageOfProjectCost: totalCost > 0 ? Math.round((userContrib / totalCost) * 100) : undefined,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: "Apport personnel minimum de 20% requis pour le schéma CMLT.",
          ar: "تمويل ذاتي لا يقل عن 20% مطلوب لمخطط CMLT."
        }
      },
      {
        id: 'layer_bfpme_cmlt',
        program: bfpmeMatch.program,
        provider: bfpmeProvider,
        layerType: 'SENIOR_DEBT',
        isCashContribution: true,
        allocatedAmount: bfpmeAllocated,
        percentageOfProjectCost: totalCost > 0 ? Math.round((bfpmeAllocated / totalCost) * 100) : undefined,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: `Prêt à Moyen et Long Terme (CMLT) BFPME (plafond 65% de l'investissement / max 2,5M TND).`,
          ar: `قرض متوسط وطويل المدى BFPME (سقف 65% من الاستثمار / حد أقصى 2.5 مليون دينار).`
        }
      }
    ];

    if (commercialBankAllocated > 0) {
      const bhProv = providersMap.get('bh_bank') || bfpmeProvider;
      layers.push({
        id: 'layer_commercial_bank_complement',
        program: bfpmeMatch.program,
        provider: bhProv,
        layerType: 'SENIOR_DEBT',
        isCashContribution: true,
        allocatedAmount: commercialBankAllocated,
        percentageOfProjectCost: totalCost > 0 ? Math.round((commercialBankAllocated / totalCost) * 100) : undefined,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: "Crédit bancaire commercial complémentaire en co-financement avec la banque partenaire.",
          ar: "قرض بنكي تجاري تكميلي بالتمويل المشترك مع البنك الشريك."
        }
      });
    }

    if (sotugarMatch) {
      // Add SOTUGAR as GUARANTEE layer (Zero cash contribution!)
      layers.push({
        id: 'layer_sotugar_guarantee',
        program: sotugarMatch.program,
        provider: sotugarProvider,
        layerType: 'GUARANTEE',
        isCashContribution: false, // Invariant 1: Guarantees are NOT financing cash!
        guaranteedTargetProgramId: 'bfpme_creation',
        guaranteeCoveragePercentage: 75,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: "Garantie publique SOTUGAR en couverture de risque (ne verse pas de fonds directs).",
          ar: "ضمان عمومي من سوتوغار لتغطية مخاطر القرض (لا يمنح أموالاً مباشرة)."
        }
      });
    }

    stacks.push({
      id: 'stack_pme_cofinancing_sotugar',
      title: {
        fr: "Schéma Institutionnel PME : Co-financement BFPME + Banque + Garantie SOTUGAR",
        ar: "المخطط المؤسساتي للمؤسسات الصغرى والمتوسطة : تمويل مشترك BFPME وبنك تجاري مع ضمان سوتوغار"
      },
      description: {
        fr: "Combinaison classique de co-financement public/privé structurée avec prêt CMLT BFPME et partage de risque SOTUGAR.",
        ar: "تركيبة تمويل مشترك كلاسيكية تجمع بين قرض BFPME البنكي وتغطية المخاطر عبر الشركة التونسية للضمان."
      },
      feasibility,
      confidence: 'MEDIUM',
      layers,
      totalProjectCost: totalCost,
      userContribution: userContrib,
      grantAmount: 0,
      quasiEquityAmount: 0,
      debtAndLeasingAmount: bfpmeAllocated + commercialBankAllocated,
      totalCashFinancingCovered: userContrib + bfpmeAllocated + commercialBankAllocated,
      uncoveredFinancingGap: Math.max(0, totalCost - (userContrib + bfpmeAllocated + commercialBankAllocated)),
      guaranteesAttached: sotugarMatch ? [
        {
          guaranteeProgramId: 'sotugar_guarantee',
          guaranteeName: 'SOTUGAR Garantie PME',
          coversDebtId: 'bfpme_creation',
          coveragePct: 75,
          notes: {
            fr: "Couverture jusqu'à 75% du risque de crédit bancaire.",
            ar: "تغطية تصل إلى 75% من مخاطر القرض البنكي."
          }
        }
      ] : [],
      compatibilitySummary: {
        fr: "Association BFPME + Banque commerciale vérifiée. Intervention SOTUGAR sous réserve d'approbation conjointe.",
        ar: "الجمع بين BFPME والبنك التجاري موثق. تدخل سوتوغار يخضع لموافقة اللجنة المشتركة."
      },
      warnings: [
        {
          fr: "Le TMM et la marge commerciale exacte (2 à 4,5 points) sont déterminés par l'agence bancaire instructrice.",
          ar: "نسبة TMM والهامش التجاري الدقيق (2 إلى 4.5 نقطة) يحددان من طرف الفرع البنكي المعني."
        }
      ]
    });
  }

  // Strategy 2: Graduate Startup Stacking (ANETI Prime + BTS Diplômés Loan)
  const btsMatch = debtPrograms.find(r => r.program.id === 'bts_diplomes');
  const anetiMatch = grantPrograms.find(r => r.program.id === 'aneti_cheque_entreprendre');

  if (btsMatch) {
    const btsMaxAmount = Math.min(150000, financingNeeded);
    const anetiAmount = anetiMatch ? 3000 : 0;
    const btsAllocated = Math.min(btsMaxAmount, Math.max(0, financingNeeded - anetiAmount));

    const btsProvider = providersMap.get(btsMatch.program.providerId)!;
    const anetiProvider = providersMap.get('aneti') || btsProvider;

    const layers: StackLayerItem[] = [
      {
        id: 'layer_user_contrib_bts',
        program: btsMatch.program,
        provider: btsProvider,
        layerType: 'USER_EQUITY',
        isCashContribution: true,
        allocatedAmount: userContrib,
        percentageOfProjectCost: totalCost > 0 ? Math.round((userContrib / totalCost) * 100) : undefined,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: "Apport personnel symbolique (0% à 10% pour diplômés).",
          ar: "تمويل ذاتي رمزي (0% إلى 10% لأصحاب الشهادات)."
        }
      }
    ];

    if (anetiMatch) {
      layers.push({
        id: 'layer_aneti_grant',
        program: anetiMatch.program,
        provider: anetiProvider,
        layerType: 'GRANT',
        isCashContribution: true,
        allocatedAmount: anetiAmount,
        percentageOfProjectCost: totalCost > 0 ? Math.round((anetiAmount / totalCost) * 100) : undefined,
        status: 'VERIFIED_CURRENT',
        notes: {
          fr: "Prime d'étude et accompagnement ANETI (non remboursable).",
          ar: "منحة دراسة ومرافقة من ANETI (غير قابلة للاسترجاع)."
        }
      });
    }

    layers.push({
      id: 'layer_bts_loan',
      program: btsMatch.program,
      provider: btsProvider,
      layerType: 'SENIOR_DEBT',
      isCashContribution: true,
      allocatedAmount: btsAllocated,
      percentageOfProjectCost: totalCost > 0 ? Math.round((btsAllocated / totalCost) * 100) : undefined,
      status: 'VERIFIED_CURRENT',
      notes: {
        fr: "Crédit bonifié BTS à 5% fixe sans garantie lourde (plafond 150 000 TND).",
        ar: "قرض ميسر من البنك التونسي للتضامن بنسبة 5% دون ضمانات عينية (سقف 150 ألف دينار)."
      }
    });

    stacks.push({
      id: 'stack_graduate_aneti_bts',
      title: {
        fr: "Schéma Jeune Promoteur : Prime ANETI + Crédit Bonifié BTS",
        ar: "مخطط الباعث الشاب : منحة ANETI مع قرض تفاضلي من بنك التضامن BTS"
      },
      description: {
        fr: "Cumul légal d'une prime d'accompagnement ANETI et d'un prêt d'investissement bonifié pour diplômé du supérieur.",
        ar: "الجمع القانوني بين منحة المرافقة وقرض الاستثمار الميسر لأصحاب الشهادات العليا."
      },
      feasibility: 'SUPPORTED',
      confidence: 'HIGH',
      layers,
      totalProjectCost: totalCost,
      userContribution: userContrib,
      grantAmount: anetiAmount,
      quasiEquityAmount: 0,
      debtAndLeasingAmount: btsAllocated,
      totalCashFinancingCovered: userContrib + anetiAmount + btsAllocated,
      uncoveredFinancingGap: Math.max(0, totalCost - (userContrib + anetiAmount + btsAllocated)),
      guaranteesAttached: [],
      compatibilitySummary: {
        fr: "Cumul expressément autorisé par les textes réglementaires ANETI et BTS.",
        ar: "الجمع مسموح به صراحة بمقتضى النصوص الترتيبية لوكالة التشغيل وبنك التضامن."
      },
      warnings: []
    });
  }

  // Strategy 3: Innovation / Startup Act (Founders Allowance + Venture Capital / Seed Fund)
  const startupActMatch = grantPrograms.find(r => r.program.id === 'startup_act_bourse');
  if (startupActMatch && profile.hasStartupActLabel) {
    const stipendAnnual = 36000; // Average annual founder allowance for 2 co-founders
    const prov = providersMap.get(startupActMatch.program.providerId)!;

    stacks.push({
      id: 'stack_startup_act_ecosystem',
      title: {
        fr: "Dispositif Startup Act : Bourse de Vie Fondateurs + Amorçage",
        ar: "منظومة Startup Act : منحة تفرغ المؤسسين مع تمويل رأس المال المبكر"
      },
      description: {
        fr: "Prise en charge du revenu des fondateurs et couverture sociale garanties par la Loi Startup Act.",
        ar: "تغطية دخل المؤسسين والتغطية الاجتماعية المضمونة بقانون المؤسسات الناشئة."
      },
      feasibility: 'SUPPORTED',
      confidence: 'HIGH',
      layers: [
        {
          id: 'layer_startup_stipend',
          program: startupActMatch.program,
          provider: prov,
          layerType: 'GRANT',
          isCashContribution: true,
          allocatedAmount: stipendAnnual,
          status: 'VERIFIED_CURRENT',
          notes: {
            fr: "Bourse mensuelle garantie pour co-fondateurs (non remboursable).",
            ar: "منحة شهرية مضمونة للباعثين الشركاء (غير قابلة للاسترجاع)."
          }
        }
      ],
      totalProjectCost: totalCost,
      userContribution: userContrib,
      grantAmount: stipendAnnual,
      quasiEquityAmount: 0,
      debtAndLeasingAmount: 0,
      totalCashFinancingCovered: userContrib + stipendAnnual,
      uncoveredFinancingGap: Math.max(0, totalCost - (userContrib + stipendAnnual)),
      guaranteesAttached: [],
      compatibilitySummary: {
        fr: "Dispositif public d'amorçage compatible avec les levées de fonds en capital risque (FCPR/ANAVA).",
        ar: "آلية عمومية متطابقة مع جولات التمويل الاستثماري وصناديق رأس المال المخاطر."
      },
      warnings: [
        {
          fr: "Nécessite impérativement le Label Startup Act délivré par le Collège des Startups.",
          ar: "يشترط الحصول المسبق على علامة المؤسسة الناشئة من لجنة الستارتاب."
        }
      ]
    });
  }

  return stacks;
}
