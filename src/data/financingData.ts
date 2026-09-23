import { Provider, FinancingProgram } from '../types/financing';

export const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 
  'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 
  'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 
  'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
] as const;

export const REGIONAL_DEVELOPMENT_ZONES = [
  'Kasserine', 'Sidi Bouzid', 'Gafsa', 'Kébili', 'Tataouine', 'Tozeur', 
  'Siliana', 'Le Kef', 'Jendouba', 'Béja', 'Kairouan', 'Médenine', 'Gabès'
];

export const PROVIDERS: Provider[] = [
  {
    id: 'bfpme',
    name: 'Banque de Financement des PME',
    acronym: 'BFPME',
    type: 'public_bank',
    description: {
      fr: "Banque publique d'investissement dédiée à la création et à l'extension des PME en Tunisie.",
      ar: "بنك تمويل المؤسسات الصغرى والمتوسطة المخصص لإحداث وتوسعة المشاريع في تونس."
    },
    website: 'https://www.bfpme.com.tn',
    headquarters: 'Tunis, Avenue Mohamed V',
    networkCoverage: {
      fr: 'Représentations régionales dans les 24 gouvernorats.',
      ar: 'مكاتب جهوية تغطي كامل الـ 24 ولاية.'
    },
    contactEmail: 'contact@bfpme.com.tn',
    contactPhone: '+216 71 184 000',
    officialBadgeText: {
      fr: 'Établissement Public Bancaire',
      ar: 'مؤسسة بنكية عمومية'
    }
  },
  {
    id: 'bts',
    name: 'Banque Tunisienne de Solidarité',
    acronym: 'BTS Bank',
    type: 'public_bank',
    description: {
      fr: 'Banque publique spécialisée dans le micro-financement, les diplômés du supérieur et les petits métiers.',
      ar: 'البنك التونسي للتضامن المتخصص في تمويل أصحاب الشهادات العليا والحرف والمهن الصغرى.'
    },
    website: 'https://www.bts.com.tn',
    headquarters: 'Tunis, Rue de la Monnaie',
    networkCoverage: {
      fr: 'Agences couvrant tous les chefs-lieux de gouvernorats.',
      ar: 'فروع تغطي كافة مراكز الولايات التونسية.'
    },
    contactEmail: 'reclamation@bts.com.tn',
    contactPhone: '+216 71 844 040',
    officialBadgeText: {
      fr: 'Banque Publique de Proximité',
      ar: 'بنك عمومي تضامني'
    }
  },
  {
    id: 'sotugar',
    name: 'Société Tunisienne de Garantie',
    acronym: 'SOTUGAR',
    type: 'guarantee_fund',
    description: {
      fr: 'Organisme public garantissant les crédits bancaires d’investissement et de trésorerie pour les PME.',
      ar: 'الشركة التونسية للضمان لتغطية مخاطر القروض البنكية للاستثمار والتسيير للمؤسسات.'
    },
    website: 'https://www.sotugar.com.tn',
    headquarters: 'Tunis, Montplaisir',
    networkCoverage: {
      fr: 'Intervention via toutes les banques partenaires de la place.',
      ar: 'تدخل عبر شبكة جميع البنوك التونسية الشريكة.'
    },
    contactEmail: 'sotugar@sotugar.com.tn',
    contactPhone: '+216 71 909 300',
    officialBadgeText: {
      fr: 'Fonds Public de Garantie',
      ar: 'صندوق عمومي للضمان'
    }
  },
  {
    id: 'apii_foprodi',
    name: 'Fonds de Promotion et de Décentralisation Industrielle (APII)',
    acronym: 'FOPRODI / APII',
    type: 'public_agency',
    description: {
      fr: 'Fonds étatique finançant les dotations remboursables et primes pour l’industrie et les services connexes.',
      ar: 'صندوق النهوض بالصناعة واللامركزية الصناعية لدعم المشاريع والمنح القابلة للاسترجاع.'
    },
    website: 'https://www.tunisieindustrie.nat.tn',
    headquarters: 'Tunis, Rue Ghaouas',
    networkCoverage: {
      fr: 'Centres APII présents dans chaque gouvernorat.',
      ar: 'مراكز وكالة النهوض بالصناعة والتجديد بكل ولاية.'
    },
    contactEmail: 'apii@apii.tn',
    contactPhone: '+216 71 792 144',
    officialBadgeText: {
      fr: 'Mécanisme Public d’Incitation',
      ar: 'آلية عمومية للتشجيع والاستثمار'
    }
  },
  {
    id: 'smart_capital',
    name: 'Smart Capital - Startup Act',
    acronym: 'Smart Capital',
    type: 'sovereign_fund',
    description: {
      fr: 'Opérateur national du cadre Startup Act gérant le Fonds de Fonds ANAVA et les bourses de startups.',
      ar: 'المشرف الوطني على قانون الشركات الناشئة وصندوق الصناديق أنفَا.'
    },
    website: 'https://startup.gov.tn',
    headquarters: 'Tunis, Les Berges du Lac',
    networkCoverage: {
      fr: 'Plateforme nationale 100% numérique pour la labellisation et le financement.',
      ar: 'منصة رقمية وطنية موحدة للترشح والحصول على علامة مؤسسة ناشئة.'
    },
    contactEmail: 'contact@smartcapital.tn',
    officialBadgeText: {
      fr: 'Opérateur Startup Act',
      ar: 'المشرف على منظومة ستارت آب آكت'
    }
  },
  {
    id: 'enda_tamweel',
    name: 'Enda Tamweel Microfinance',
    acronym: 'Enda Tamweel',
    type: 'microfinance',
    description: {
      fr: 'Institution de microfinance pionnière finançant les micro-entrepreneurs, agriculteurs et artisans.',
      ar: 'مؤسسة التمويل الصغير الرائدة لدعم صغار الباعثين والحرفيين والفلاحين.'
    },
    website: 'https://www.endatamweel.tn',
    headquarters: 'Tunis, Cité El Khadra',
    networkCoverage: {
      fr: 'Plus de 105 agences à travers tout le territoire tunisien.',
      ar: 'أكثر من 105 فرعاً في مختلف المعتمديات والمناطق.'
    },
    contactEmail: 'contact@endatamweel.tn',
    contactPhone: '+216 71 908 908',
    officialBadgeText: {
      fr: 'Institution de Microfinance Agréée',
      ar: 'مؤسسة تمويل أصغر معتمدة'
    }
  },
  {
    id: 'banque_zitouna',
    name: 'Banque Zitouna (Finance Islamique)',
    acronym: 'Banque Zitouna',
    type: 'islamic_bank',
    description: {
      fr: 'Première banque islamique en Tunisie offrant des formules de Mourabaha et Ijara conformes à la Charia.',
      ar: 'أول بنك إسلامي في تونس يقدم صيغ المرابحة والإجارة المتوافقة مع الشريعة.'
    },
    website: 'https://www.banquezitouna.com',
    headquarters: 'Tunis, Le Kram',
    networkCoverage: {
      fr: 'Réseau de plus de 170 agences bancaires.',
      ar: 'شبكة تتجاوز 170 فرعاً بنكياً في تونس.'
    },
    contactEmail: 'contact@banquezitouna.com',
    contactPhone: '+216 81 10 55 55',
    officialBadgeText: {
      fr: 'Banque Islamique Conventionnée',
      ar: 'مصرف إسلامي معتمد'
    }
  },
  {
    id: 'aneti',
    name: 'Agence Nationale pour l’Emploi et le Travail Indépendant',
    acronym: 'ANETI',
    type: 'public_agency',
    description: {
      fr: 'Agence publique d’accompagnement, octroi du Chèque Entreprise et des primes d’appui aux nouveaux promoteurs.',
      ar: 'الوكالة الوطنية للتشغيل والعمل المستقل لتقديم صك المؤسسة والمنح المرافقة للباعثين.'
    },
    website: 'https://www.emploi.nat.tn',
    headquarters: 'Tunis, Avenue de Madrid',
    networkCoverage: {
      fr: 'Bureaux de l’Emploi et Espaces Entreprendre dans chaque délégation.',
      ar: 'مكاتب تشغيل وفضاءات مبادرة في مختلف المعتمديات.'
    },
    contactEmail: 'aneti@emploi.nat.tn',
    officialBadgeText: {
      fr: 'Dispositif National pour l’Initiative Privée',
      ar: 'جهاز وطني لمساندة العمل المستقل'
    }
  }
];

export const FINANCING_PROGRAMS: FinancingProgram[] = [
  {
    id: 'bfpme_creation',
    code: 'BFPME-CREAT',
    providerId: 'bfpme',
    name: {
      fr: "Crédit d'Investissement PME - Création",
      ar: 'قرض الاستثمار لإحداث المؤسسات الصغرى والمتوسطة'
    },
    tagline: {
      fr: 'Financement moyen et long terme pour l’acquisition d’équipements et constructions industrielles/services.',
      ar: 'تمويل متوسط وطويل المدى لاقتناء التجهيزات والإنشاءات الصناعية والخدماتية.'
    },
    category: 'bank_loan',
    purposes: ['creation', 'equipment', 'expansion'],
    minAmount: 50000,
    maxAmount: 5000000,
    minContributionPercent: 20,
    rateType: 'variable_tmm',
    rateDescription: {
      fr: 'Taux variable indexé sur le TMM officiel de la BCT + marge bancaire selon notation du projet (à confirmer avec l’agence).',
      ar: 'نسبة متغيرة مرتبطة بمعدل TMM للبنك المركزي التونسي + هامش بنكي وفق دراسة المشروع (يحدد مع الفرع).'
    },
    durationMonthsMin: 36,
    durationMonthsMax: 120,
    gracePeriodMonthsMin: 12,
    gracePeriodMonthsMax: 36,
    guaranteeRequirements: {
      fr: 'Intervention obligatoire ou recommandée de la SOTUGAR (jusqu’à 60-70%), nantissement matériel, hypothèque éventuelle.',
      ar: 'تدخل الشركة التونسية للضمان (SOTUGAR) بنسبة تصل إلى 60-70% ورهن المعدات.'
    },
    targetAudience: {
      fr: 'Entrepreneurs tunisiens créant ou développant une PME dans l’industrie, les TIC, la santé ou les services à forte valeur ajoutée.',
      ar: 'أصحاب المشاريع التونسيين لإحداث أو توسعة شركات صناعية أو تكنولوجية أو خدماتية.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y'],
      sectors: ['industry', 'ict_tech', 'services', 'renewable_energy', 'tourism', 'agriculture_agribusiness'],
      allowedLegalForms: ['suarl', 'sarl', 'sa'],
      requiresDegree: false,
      otherRules: [
        {
          fr: 'Nécessite une étude technico-économique (Business Plan) complète et validée.',
          ar: 'يشترط تقديم دراسة جدوى فنية واقتصادية متكاملة.'
        },
        {
          fr: 'Apport personnel minimum de 20% (peut être complété par une dotation FOPRODI en ZDR).',
          ar: 'تمويل ذاتي لا يقل عن 20% (يمكن تدعيمه بصندوق فبرودي في مناطق التنمية الجهوية).'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'bp_tech',
        name: {
          fr: 'Business Plan détaillé avec plan financier sur 5 ans',
          ar: 'مخطط أعمال مفصل مع توقعات مالية لـ 5 سنوات'
        },
        category: 'technical_business_plan',
        mandatory: true
      },
      {
        id: 'devis_proforma',
        name: {
          fr: 'Devis pro-forma récents et factures pro-forma des équipements',
          ar: 'فواتير تقديرية حديثة للتجهيزات والمعدات'
        },
        category: 'quotations_invoices',
        mandatory: true
      },
      {
        id: 'rne_statuts',
        name: {
          fr: 'Extrait RNE récent et statuts de la société (ou projet de statuts)',
          ar: 'مضمون حديث من السجل الوطني للمؤسسات والقانون الأساسي'
        },
        category: 'legal',
        mandatory: true
      },
      {
        id: 'cin_promoteur',
        name: {
          fr: 'Copie CIN du ou des promoteurs avec CV détaillé',
          ar: 'نسخة من بطاقة التعريف الوطنية وسيرة ذاتية مفصلة للباعث'
        },
        category: 'identity',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Dépôt du dossier en ligne ou régional', ar: 'إيداع الملف إلكترونياً أو بالفرع الجهوي' },
        description: {
          fr: 'Soumission du business plan et des pièces justificatives via la plateforme BFPME ou au bureau régional.',
          ar: 'تقديم دراسة الجدوى والوثائق عبر منصة البنك أو الممثلية الجهوية.'
        }
      },
      {
        step: 2,
        title: { fr: 'Instruction technique et financière', ar: 'الدراسة الفنية والمالية' },
        description: {
          fr: 'Examen de viabilité par les analystes de la banque et visites éventuelles sur site.',
          ar: 'تقييم الجدوى الاقتصادية من طرف خبراء البنك وزيارة الموقع.'
        }
      },
      {
        step: 3,
        title: { fr: 'Comité de crédit & Accord de principe', ar: 'لجنة القروض والموافقة المبدئية' },
        description: {
          fr: 'Passage devant le comité de crédit pour décision formelle et fixation des conditions de garantie.',
          ar: 'عرض الملف على لجنة التمويل لتحديد الضمانات وشروط الصرف.'
        }
      },
      {
        step: 4,
        title: { fr: 'Mise en place et déblocage progressif', ar: 'إبرام العقد والصرف التدريجي' },
        description: {
          fr: 'Déblocage des fonds directement aux fournisseurs d’équipements sur présentation des factures.',
          ar: 'صرف التمويل مباشرة للمزودين بموجب الفواتير النهائية.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Le fonds de roulement seul n’est pas finançable par ce produit; il doit accompagner un investissement matériel.',
        ar: 'لا يمكن تمويل رأس المال العامل بمفرده دون استثمار مادي في التجهيزات.'
      },
      {
        fr: 'Les délais d’instruction varient généralement entre 4 et 12 semaines.',
        ar: 'تتراوح مدة دراسة الملف بين 4 و 12 أسبوعاً في العادة.'
      }
    ],
    hasRegionalDevelopmentBonus: true,
    accessibleWithoutHeavyCollateral: false,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.bfpme.com.tn/fr/financement/credit-investissement',
      sourceTitle: 'BFPME - Guide officiel du crédit d’investissement PME',
      sourceType: 'bank_fiche',
      dateChecked: '2026-06-15',
      verifiedFields: ['minAmount', 'maxAmount', 'minContributionPercent', 'durationMonthsMax', 'purposes'],
      unverifiedFields: ['exactMarginOverTMM', 'variableCommercialSpread'],
      notes: {
        fr: 'Montants et durées vérifiés d’après la fiche institutionnelle BFPME. La marge exacte (+2,5% à +3,5% sur TMM) dépend de la décision du comité de crédit.',
        ar: 'تم التحقق من السقوف والآجال استناداً لدليل المنتجات الرسمي. الهامش الدقيق (+2.5% إلى +3.5% فوق TMM) يحدده قرار لجنة القروض.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'bts_diplomes',
    code: 'BTS-DIP-SUP',
    providerId: 'bts',
    name: {
      fr: 'Crédit BTS - Diplômés de l’Enseignement Supérieur',
      ar: 'قرض البنك التونسي للتضامن لأصحاب الشهادات العليا'
    },
    tagline: {
      fr: 'Crédit bonifié sans garanties lourdes pour diplômés universitaires créant leur première entreprise.',
      ar: 'تمويل ميسر بدون ضمانات عينية ثقيلة لحاملي الشهادات الجامعية لبعث مشروعهم الأول.'
    },
    category: 'subsidized_loan',
    purposes: ['creation', 'equipment', 'working_capital', 'expansion', 'agriculture'],
    minAmount: 5000,
    maxAmount: 150000,
    minContributionPercent: 10,
    rateType: 'subsidized',
    rateDescription: {
      fr: 'Taux bonifié préférentiel de 5% à 7% l’an (taux d’intérêt réduit soutenu par l’État).',
      ar: 'نسبة فائدة تفاضلية ميسرة بين 5% و 7% سنوياً مدعومة من الدولة.'
    },
    estimatedRateAnnual: 6.0,
    durationMonthsMin: 24,
    durationMonthsMax: 84,
    gracePeriodMonthsMin: 6,
    gracePeriodMonthsMax: 24,
    guaranteeRequirements: {
      fr: 'Caution personnelle ou aval solidaire, sans obligation d’hypothèque immobilière.',
      ar: 'ضمان شخصي أو كفالة تضامنية دون اشتراط رهن عقاري.'
    },
    targetAudience: {
      fr: 'Titulaires d’un diplôme universitaire (Licence, Master, Ingénieur, Doctorat) cherchant à s’installer à leur compte.',
      ar: 'المتحصلون على شهادات التعليم العالي الباحثون عن بعث مشاريع خاصة.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y'],
      sectors: ['services', 'ict_tech', 'industry', 'crafts_trades', 'agriculture_agribusiness', 'commerce'],
      allowedLegalForms: ['individual', 'suarl', 'sarl'],
      requiresDegree: true,
      maxAge: 45,
      otherRules: [
        {
          fr: 'Diplôme de l’enseignement supérieur reconnu ou homologué en Tunisie obligatoire.',
          ar: 'شهادة تعليم عالٍ معترف بها أو معادلة في تونس وجوباً.'
        },
        {
          fr: 'Ne pas être déjà titulaire d’un crédit BTS impayé ou fiché à la BCT.',
          ar: 'ألا يكون للمترشح متخلدات ديون بنكية غير مسواة لدى البنك المركزي.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'diplome_sup',
        name: {
          fr: 'Copie certifiée conforme du diplôme de l’enseignement supérieur',
          ar: 'نسخة مطابقة للأصل من شهادة التعليم العالي'
        },
        category: 'identity',
        mandatory: true
      },
      {
        id: 'fiche_projet_bts',
        name: {
          fr: 'Dossier de projet / Fiche de rentabilité (modèle BTS)',
          ar: 'ملف المشروع واستمارة المردودية وفق نموذج بنك التضامن'
        },
        category: 'technical_business_plan',
        mandatory: true
      },
      {
        id: 'devis_bts',
        name: {
          fr: 'Devis des équipements et matériel prévus',
          ar: 'فواتير تقديرية للمعدات والتجهيزات المطلوبة'
        },
        category: 'quotations_invoices',
        mandatory: true
      },
      {
        id: 'local_bail',
        name: {
          fr: 'Promesse de bail ou titre d’exploitation du local',
          ar: 'وعد كراء أو شهادة تصرف في المحل المخصص للمشروع'
        },
        category: 'legal',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Accompagnement Espace Entreprendre / ANETI', ar: 'المرافقة بفضاء المبادرة / التشغيل' },
        description: {
          fr: 'Validation de l’idée et élaboration de la fiche projet avec un conseiller ANETI.',
          ar: 'تأطير الفكرة وإعداد بطاقة المشروع بالتعاون مع مستشار فضاء المبادرة.'
        }
      },
      {
        step: 2,
        title: { fr: 'Dépôt auprès de l’agence BTS régionale', ar: 'إيداع الملف بفرع بنك التضامن' },
        description: {
          fr: 'Remise du dossier complet et entretien avec le chargé de clientèle.',
          ar: 'تسليم الملف الكامل وإجراء مقابلة مع مسؤول التمويل بالفرع.'
        }
      },
      {
        step: 3,
        title: { fr: 'Commission régionale d’octroi', ar: 'اللجنة الجهوية لمنح القروض' },
        description: {
          fr: 'Décision d’accord et déblocage progressif sur présentation des justificatifs.',
          ar: 'المصادقة على القرض وتحرير الشيكات الموجهة للمزودين.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Plafond strict de 150 000 DT pour les diplômés supérieurs (limité à 25 000 DT sans diplôme universitaire via la filière petits métiers).',
        ar: 'السقف محدد بـ 150 ألف دينار لأصحاب الشهادات العليا (و25 ألف دينار لغير الحاملين لشهادات).'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.bts.com.tn/promoteurs-diplomes/',
      sourceTitle: 'BTS Bank - Conditions d’octroi des crédits aux diplômés',
      sourceType: 'bank_fiche',
      dateChecked: '2026-05-10',
      verifiedFields: ['maxAmount', 'rate', 'minContributionPercent', 'requiresDegree', 'durationMonths', 'gracePeriodMonths'],
      unverifiedFields: ['guaranteeRequirements'],
      notes: {
        fr: 'Plafond (150 000 DT), apport minimum (10%) et conditions de diplôme vérifiés via circulaire BTS. La caution ou garantie locale exacte reste soumise à la commission régionale.',
        ar: 'تم التحقق من سقف 150 ألف د والتمويل الذاتي 10% والشهادة الجامعية. الضمان الشخصي أو العيني يحدده الفرع الجهوي.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'sotugar_guarantee',
    code: 'SOTUGAR-INVEST',
    providerId: 'sotugar',
    name: {
      fr: 'Garantie SOTUGAR - Crédits d’Investissement PME',
      ar: 'ضمان الشركة التونسية للضمان لقروض الاستثمار'
    },
    tagline: {
      fr: 'Couverture publique de 50% à 75% du risque de crédit pour débloquer les financements bancaires classiques.',
      ar: 'تغطية عمومية بنسبة 50% إلى 75% من مخاطر القرض لتسهيل موافقة البنوك التجارية.'
    },
    category: 'guarantee',
    purposes: ['creation', 'equipment', 'expansion', 'innovation_rd'],
    minAmount: 20000,
    maxAmount: 2500000,
    minContributionPercent: 15,
    rateType: 'fixed',
    rateDescription: {
      fr: 'Commission de garantie minime de 0,5% à 1% l’an intégrée dans le plan de remboursement bancaire.',
      ar: 'عمولة ضمان سنوية رمزية بين 0.5% و 1% مدمجة ضمن جدول استخلاص القرض البنكي.'
    },
    estimatedRateAnnual: 0.75,
    durationMonthsMin: 24,
    durationMonthsMax: 120,
    gracePeriodMonthsMin: 6,
    gracePeriodMonthsMax: 36,
    guaranteeRequirements: {
      fr: 'Remplace les hypothèques lourdes exigées par les banques commerciales partenaires.',
      ar: 'يعوض الرهون العقارية المشطة المطلوبة عادة من البنوك التجارية.'
    },
    targetAudience: {
      fr: 'PME en création ou en phase de développement manquant de garanties réelles immobilières.',
      ar: 'المؤسسات الصغرى والمتوسطة التي تنقصها الضمانات العينية والعقارية الكافية.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y'],
      sectors: ['industry', 'services', 'ict_tech', 'renewable_energy', 'agriculture_agribusiness', 'tourism'],
      allowedLegalForms: ['suarl', 'sarl', 'sa', 'agricultural_coop'],
      otherRules: [
        {
          fr: 'Le dossier est obligatoirement transmis par une banque partenaire (BFPME, STB, BNA, BIAT, Attijari, etc.).',
          ar: 'يتم إيداع الملف وجوباً عن طريق بنك تجاري شريك منخرط في الآلية.'
        },
        {
          fr: 'Taux de couverture majoré à 75% pour les projets implantés en Zones de Développement Régional (ZDR).',
          ar: 'ترتفع نسبة الضمان إلى 75% للمشاريع المقامة بمناطق التنمية الجهوية.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'accord_banque',
        name: {
          fr: 'Accord conditionnel ou dossier d’instruction de la banque partenaire',
          ar: 'موافقة مشروطة أو ملف دراسة القرض من البنك الممول'
        },
        category: 'financial',
        mandatory: true
      },
      {
        id: 'dossier_sotugar',
        name: {
          fr: 'Fiche d’adhésion au fonds de garantie SOTUGAR',
          ar: 'استمارة الانخراط في صندوق ضمان سوتوغار'
        },
        category: 'legal',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Demande auprès de la banque créancière', ar: 'تقديم المطلب لدى البنك المقرض' },
        description: {
          fr: 'L’entrepreneur négocie son prêt et sollicite la couverture du mécanisme SOTUGAR.',
          ar: 'يتقدم الباعث بطلب القرض ويطلب إدراج ضمان سوتوغار.'
        }
      },
      {
        step: 2,
        title: { fr: 'Transmission du dossier à SOTUGAR', ar: 'إحالة الملف إلى شركة الضمان' },
        description: {
          fr: 'La banque transmet la demande pour accord d’intervention du fonds.',
          ar: 'يحيل البنك الملف التقني للحصول على موافقة الضمان.'
        }
      },
      {
        step: 3,
        title: { fr: 'Notification et signature de l’acte', ar: 'المصادقة وإتمام العقد' },
        description: {
          fr: 'Délivrance de l’attestation de garantie facilitant l’accord définitif et le déblocage par la banque partenaire.',
          ar: 'إصدار شهادة الضمان لتسهيل الموافقة النهائية وسحب القرض من البنك الشريك.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'SOTUGAR n’accorde pas de prêts directs: c’est un fonds de garantie intervenant en soutien des banques.',
        ar: 'الشركة لا تمنح قروضاً مباشرة بل تضمن قروض البنوك الشريكة.'
      }
    ],
    hasRegionalDevelopmentBonus: true,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.sotugar.com.tn/mecanismes-de-garantie/',
      sourceTitle: 'SOTUGAR - Mécanismes de garantie des investissements PME',
      sourceType: 'official_portal',
      dateChecked: '2026-07-01',
      verifiedFields: ['maxAmount', 'rate', 'guaranteeRequirements', 'eligibilityCriteria'],
      unverifiedFields: ['partnerBankApproval'],
      notes: {
        fr: 'Taux de couverture (jusqu’à 75%) et commissions vérifiés sur le portail SOTUGAR. L’octroi effectif reste conditionné à l’accord préalable de la banque partenaire.',
        ar: 'تم التثبت من نسب التغطية وعمولة الضمان من البوابة الرسمية. إصدار الضمان مشروط بالموافقة المسبقة للبنك المقرض.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'foprodi_dotation',
    code: 'FOPRODI-APII',
    providerId: 'apii_foprodi',
    name: {
      fr: 'FOPRODI - Dotation Remboursable & Prime d’Investissement',
      ar: 'صندوق النهوض بالصناعة (فبرودي) - مساهمة قابلة للاسترجاع ومنحة'
    },
    tagline: {
      fr: 'Apport de quasi-fonds propres sous forme de dotation remboursable à taux préférentiel de 1% à 3%.',
      ar: 'مساهمة في التمويل الذاتي كأموال شبه ذاتية قابلة للاسترجاع بنسبة 1% إلى 3%.'
    },
    category: 'grant_subsidy',
    purposes: ['creation', 'equipment', 'expansion'],
    minAmount: 30000,
    maxAmount: 800000,
    minContributionPercent: 10,
    rateType: 'subsidized',
    rateDescription: {
      fr: 'Taux symbolique de 1% à 3% sur la dotation remboursable étatique.',
      ar: 'نسبة رمزية بين 1% و 3% على المبالغ القابلة للاسترجاع.'
    },
    estimatedRateAnnual: 2.0,
    durationMonthsMin: 60,
    durationMonthsMax: 144,
    gracePeriodMonthsMin: 36,
    gracePeriodMonthsMax: 60,
    guaranteeRequirements: {
      fr: 'Sans hypothèque personnelle, adossé à la participation au capital.',
      ar: 'بدون رهن عقاري، مرتبط بالمساهمة في رأس المال.'
    },
    targetAudience: {
      fr: 'Nouveaux promoteurs dans les secteurs de l’industrie manufacturière et des services liés à l’industrie, priorité aux régions.',
      ar: 'الباعثون الجدد في الصناعات المعملية والخدمات المرتبطة بالصناعة، مع أولوية لمناطق التنمية.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway'],
      sectors: ['industry', 'ict_tech', 'renewable_energy', 'services'],
      allowedLegalForms: ['suarl', 'sarl', 'sa'],
      otherRules: [
        {
          fr: 'Dépôt d’une déclaration d’investissement auprès de l’APII obligatoire.',
          ar: 'إيداع تصريح استثمار لدى وكالة النهوض بالصناعة والتجديد إجباري.'
        },
        {
          fr: 'Projets en Zone de Développement Régional bénéficient de primes d’investissement allant jusqu’à 15% du coût du projet.',
          ar: 'المشاريع في مناطق التنمية الجهوية تنتفع بمنح استثمار تصل إلى 15% من كلفة المشروع.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'declaration_apii',
        name: {
          fr: 'Attestation de dépôt de déclaration d’investissement APII',
          ar: 'شهادة إيداع تصريح استثمار من وكالة APII'
        },
        category: 'legal',
        mandatory: true
      },
      {
        id: 'etude_foprodi',
        name: {
          fr: 'Dossier d’agrément FOPRODI et étude technico-financière',
          ar: 'ملف المصادقة على امتيازات فبرودي ودراسة فنية'
        },
        category: 'technical_business_plan',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Déclaration APII', ar: 'تصريح بالاستثمار لدى وكالة النهوض بالصناعة' },
        description: {
          fr: 'Enregistrement du projet en ligne sur le guichet unique de l’APII.',
          ar: 'تسجيل المشروع بالمنصة الإلكترونية للمخاطب الوحيد.'
        }
      },
      {
        step: 2,
        title: { fr: 'Agrément et instruction bancaire conjointe', ar: 'المصادقة والتقييم المشترك' },
        description: {
          fr: 'Validation par la commission APII/BFPME et transmission à la banque mandatée.',
          ar: 'المصادقة من لجنة الحوافز وإحالتها للبنك المتصرف.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Réservé aux activités industrielles ou de services connexes (exclusion du commerce de détail et négoce).',
        ar: 'مخصص للأنشطة الصناعية والخدمات ذات الصلة دون التجارة والتوزيع.'
      }
    ],
    hasRegionalDevelopmentBonus: true,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.tunisieindustrie.nat.tn/fr/doc.asp?mcat=12&mrub=88',
      sourceTitle: 'APII - Mécanismes FOPRODI & Décentralisation',
      sourceType: 'decree_law',
      dateChecked: '2026-04-18',
      verifiedFields: ['maxAmount', 'rate', 'durationMonthsMax', 'gracePeriodMonthsMax', 'minContributionPercent', 'purposes'],
      unverifiedFields: ['regionalBonusRate'],
      notes: {
        fr: 'Plafond de dotation (jusqu’à 800 000 DT) et taux symbolique (1-3%) vérifiés par décret APII. Le taux exact de la prime dépend de la délégation de rattachement.',
        ar: 'سقف المساهمة ونسبة الفائدة الرمزية محددة بالقانون. النسبة الدقيقة لمنحة التنمية الجهوية تتبع المعتمدية.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'startup_act_bourse',
    code: 'STARTUP-LABEL',
    providerId: 'smart_capital',
    name: {
      fr: 'Bourse de Startup & Avantages Startup Act',
      ar: 'منحة المؤسسة الناشئة وحوافز قانون ستارت آب آكت'
    },
    tagline: {
      fr: 'Bourse de subsistance pour fondateurs (jusqu’à 5 000 DT/mois pendant 12 mois) + exonérations fiscales.',
      ar: 'منحة شهرية لمؤسسي الشركات الناشئة (تصل إلى 5000 د/شهرياً لـ 12 شهراً) وإعفاءات ضريبية.'
    },
    category: 'grant_subsidy',
    purposes: ['innovation_rd', 'creation', 'working_capital'],
    minAmount: 12000,
    maxAmount: 60000,
    minContributionPercent: 0,
    rateType: 'interest_free',
    rateDescription: {
      fr: 'Subvention non remboursable versée mensuellement aux cofondateurs labellisés.',
      ar: 'منحة غير قابلة للاسترجاع تصرف شهرياً للمؤسسين الحاصلين على العلامة.'
    },
    estimatedRateAnnual: 0,
    durationMonthsMin: 12,
    durationMonthsMax: 24,
    gracePeriodMonthsMin: 0,
    gracePeriodMonthsMax: 0,
    guaranteeRequirements: {
      fr: 'Aucune garantie requise (Subvention d’État conditionnée à la labellisation Startup Act).',
      ar: 'بدون أي ضمانات (منحة رسمية مشروطة بالحصول على علامة مؤسسة ناشئة).'
    },
    targetAudience: {
      fr: 'Fondateurs de startups innovantes à fort potentiel d’évolutivité (scalabilité).',
      ar: 'مؤسسو الشركات الناشئة التكنولوجية والمبتكرة ذات القدرة العالية على التوسع.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y'],
      sectors: ['ict_tech', 'services', 'renewable_energy', 'industry'],
      allowedLegalForms: ['suarl', 'sarl', 'sa', 'not_yet_created'],
      requiresStartupLabel: true,
      otherRules: [
        {
          fr: 'Obtention du label officiel Startup Act délivré par le collège de labellisation.',
          ar: 'الحصول على علامة مؤسسة ناشئة من لجنة Labellisation.'
        },
        {
          fr: 'Le promoteur doit être dédié à 100% à sa startup (congé pour création de startup ou demandeur d’emploi).',
          ar: 'تفرغ المؤسس الكامل للعمل على مشروعه الناشئ.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'label_startup_cert',
        name: {
          fr: 'Attestation officielle de labellisation Startup Act',
          ar: 'شهادة إسناد علامة مؤسسة ناشئة'
        },
        category: 'legal',
        mandatory: true
      },
      {
        id: 'pitch_deck',
        name: {
          fr: 'Pitch Deck et présentation du modèle économique scalable',
          ar: 'ملف العرض التقديمي (Pitch Deck) ونموذج العمل التجاري'
        },
        category: 'technical_business_plan',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Candidature au Label sur startup.gov.tn', ar: 'الترشح للحصول على العلامة عبر المنصة' },
        description: {
          fr: 'Dépôt de la vidéo de présentation et du dossier de candidature en ligne.',
          ar: 'إيداع فيديو تقديمي وملف المشروع بالمنصة الوطنية.'
        }
      },
      {
        step: 2,
        title: { fr: 'Passage devant le Collège de labellisation', ar: 'التقييم أمام هيئة الخبراء' },
        description: {
          fr: 'Évaluation de l’innovation et du potentiel de croissance internationale.',
          ar: 'تقييم درجة التجديد وفرص النمو المحلي والدولي.'
        }
      },
      {
        step: 3,
        title: { fr: 'Activation de la bourse et des avantages', ar: 'تفعيل المنحة والحوافز القانونية' },
        description: {
          fr: 'Versement de la bourse mensuelle et exonération d’impôt sur les sociétés.',
          ar: 'صرف المنحة الشهرية والتمتع بالإعفاءات الضريبية والديوانية.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'La bourse est réservée à un maximum de 3 cofondateurs par startup.',
        ar: 'تسند المنحة لـ 3 مؤسسين كحد أقصى لكل شركة ناشئة.'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://startup.gov.tn/fr/advantages',
      sourceTitle: 'Startup Act Tunisie - Portail officiel du gouvernement',
      sourceType: 'official_portal',
      dateChecked: '2026-08-01',
      verifiedFields: ['maxAmount', 'rate', 'minContributionPercent', 'durationMonths', 'requiresStartupLabel', 'purposes'],
      unverifiedFields: ['collegeDecision'],
      notes: {
        fr: 'Montants mensuels (jusqu’à 5 000 DT/mois) et durée vérifiés selon la Loi n° 2018-20. L’octroi de la bourse dépend de la labellisation par le Collège des Startups.',
        ar: 'تم التحقق من قيمة المنحة الشهرية وشروطها بموجب القانون عدد 20 لسنة 2018. صرف المنحة مشروط بقرار لجنة Labellisation.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'enda_microcredit_equip',
    code: 'ENDA-TAMWEEL-EQ',
    providerId: 'enda_tamweel',
    name: {
      fr: 'Micro-Crédit Équipement & Métier - Enda Tamweel',
      ar: 'تمويل التجهيزات والمهن الحرة - إندا تمويل'
    },
    tagline: {
      fr: 'Financement rapide sous 7 à 10 jours pour outillage, machines et besoins d’exploitation immédiats.',
      ar: 'تمويل سريع خلال 7 إلى 10 أيام لاقتناء الآلات والمعدات وحاجيات النشاط الفورية.'
    },
    category: 'microcredit',
    purposes: ['equipment', 'working_capital', 'creation', 'agriculture'],
    minAmount: 1000,
    maxAmount: 40000,
    minContributionPercent: 0,
    rateType: 'fixed',
    rateDescription: {
      fr: 'Taux effectif global microfinance variable (16% à 24% selon montant, durée et agence).',
      ar: 'نسبة تمويل أصغر فعلية متغيرة (بين 16% و 24% سنوياً بحسب المدة والمبلغ والتقييم الميداني).'
    },
    durationMonthsMin: 6,
    durationMonthsMax: 48,
    gracePeriodMonthsMin: 0,
    gracePeriodMonthsMax: 6,
    guaranteeRequirements: {
      fr: 'Caution solidaire d’un garant salarié ou commerçant, pas de garantie hypothécaire.',
      ar: 'ضمان شخصي لكفيل أو موظف أو تاجر دون اشتراط ضمانات عقارية.'
    },
    targetAudience: {
      fr: 'Micro-entrepreneurs, artisans, commerçants, agriculteurs exclus des circuits bancaires traditionnels.',
      ar: 'صغار الباعثين، الحرفيين، أصحاب المتاجر، والفلاحين الذين يتعذر عليهم التعامل مع البنوك الكبرى.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y'],
      sectors: ['crafts_trades', 'commerce', 'services', 'agriculture_agribusiness', 'industry'],
      allowedLegalForms: ['individual', 'suarl', 'not_yet_created'],
      otherRules: [
        {
          fr: 'Enquête de proximité effectuée au local d’activité par un agent de crédit Enda.',
          ar: 'معاينة ميدانية للمحل من طرف مرشد التمويل الميداني.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'cin_demandeur',
        name: {
          fr: 'Copie CIN du promoteur et du garant',
          ar: 'نسخة من بطاقة تعريف الباعث والضامن'
        },
        category: 'identity',
        mandatory: true
      },
      {
        id: 'justif_revenu_garant',
        name: {
          fr: 'Fiche de paie ou extrait de compte du garant',
          ar: 'كشف حساب أو بطاقة خلاص للضامن'
        },
        category: 'financial',
        mandatory: true
      },
      {
        id: 'facture_devis_enda',
        name: {
          fr: 'Devis ou facture de l’équipement convoité',
          ar: 'فاتورة تقديرية للتجهيز أو المواد الأولية'
        },
        category: 'quotations_invoices',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Visite en agence ou contact agent mobile', ar: 'زيارة الفرع أو الاتصال بالمرشد' },
        description: {
          fr: 'Entretien découverte et dépôt de la demande dans l’agence de proximité la plus proche.',
          ar: 'إجراء المقابلة الأولى بأقرب فرع للمعتمدية.'
        }
      },
      {
        step: 2,
        title: { fr: 'Visite de terrain et validation', ar: 'الزيارة الميدانية والتقييم' },
        description: {
          fr: 'Vérification de la faisabilité sur place et décision sous 48h.',
          ar: 'معاينة مقر النشاط واتخاذ القرار خلال 48 ساعة.'
        }
      },
      {
        step: 3,
        title: { fr: 'Décaissement des fonds', ar: 'صرف المبلغ' },
        description: {
          fr: 'Mise à disposition par virement bancaire ou carte prépayée.',
          ar: 'توفير التمويل عبر تحويل أو بطاقة بنكية.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Le coût global du crédit est nettement plus élevé qu’en banque classique en raison des coûts de gestion de la microfinance.',
        ar: 'كلفة التمويل الأصغر أعلى من القروض البنكية التقليدية نظراً لطبيعة المخاطر والمتابعة الميدانية.'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.endatamweel.tn/nos-produits/',
      sourceTitle: 'Enda Tamweel - Produits de microcrédit professionnel',
      sourceType: 'official_portal',
      dateChecked: '2026-06-25',
      verifiedFields: ['minAmount', 'maxAmount', 'durationMonthsMax'],
      unverifiedFields: ['exactEffectiveRatePerProfile', 'processingFees'],
      notes: {
        fr: 'Plafond légal microfinance à 40 000 DT vérifié, mais le taux effectif global (16% à 24%) dépend de la notation interne du client et de la durée.',
        ar: 'السقف القانوني الأقصى 40 ألف دينار متطابق مع التشريعات، لكن النسبة الفعلية (16% إلى 24%) تختلف بحسب التقييم والمدة.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'banque_zitouna_mourabaha',
    code: 'ZITOUNA-MOURABAHA',
    providerId: 'banque_zitouna',
    name: {
      fr: 'Mourabaha Équipements Professionnels - Banque Zitouna',
      ar: 'مرابحة التجهيزات المهنية - مصرف الزيتونة'
    },
    tagline: {
      fr: 'Acquisition d’équipements et véhicules utilitaires selon les principes de la finance islamique.',
      ar: 'اقتناء المعدات والسيارات النفعية وفق مبادئ الصيرفة الإسلامية دون فوائد ربوية.'
    },
    category: 'islamic_finance',
    purposes: ['equipment', 'expansion', 'creation'],
    minAmount: 15000,
    maxAmount: 1000000,
    minContributionPercent: 20,
    rateType: 'profit_margin',
    rateDescription: {
      fr: 'Marge bénéficiaire Mourabaha fixée par contrat bilatéral lors de l’acquisition du matériel.',
      ar: 'هامش ربح مرابحة يحدد بموجب العقد عند شراء التجهيزات من المزود.'
    },
    durationMonthsMin: 12,
    durationMonthsMax: 84,
    gracePeriodMonthsMin: 0,
    gracePeriodMonthsMax: 12,
    guaranteeRequirements: {
      fr: 'Gage sur le matériel acquis, délégation d’assurance Takaful, intervention SOTUGAR éligible.',
      ar: 'رهن المعدات المقتناة وتأمين تكافلي وتدخل متاح عبر صندوق سوتوغار.'
    },
    targetAudience: {
      fr: 'Professionnels, PME et industriels privilégiant un financement éthique et conforme à la Charia.',
      ar: 'أصحاب الأعمال والشركات الراغبين في تمويلات متوافقة مع أحكام الشريعة الإسلامية.'
    },
    eligibilityCriteria: {
      stages: ['creation_underway', 'established_under_2y', 'established_over_2y'],
      sectors: ['industry', 'services', 'commerce', 'agriculture_agribusiness', 'ict_tech', 'renewable_energy'],
      allowedLegalForms: ['individual', 'suarl', 'sarl', 'sa'],
      otherRules: [
        {
          fr: 'L’objet du financement doit respecter la conformité éthique (activités licites selon le comité Charia).',
          ar: 'أن يكون النشاط مباحاً ومتوافقاً مع معايير هيئة الرقابة الشرعية للمصرف.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'devis_fournisseur_zitouna',
        name: {
          fr: 'Facture pro-forma émise par un fournisseur agréé au nom de la banque',
          ar: 'فاتورة تقديرية باسم المصرف لاقتناء التجهيزات من المزود'
        },
        category: 'quotations_invoices',
        mandatory: true
      },
      {
        id: 'etats_financiers_zitouna',
        name: {
          fr: 'États financiers des 2 derniers exercices ou Business Plan prévisionnel',
          ar: 'القوائم المالية لآخر سنتين أو مخطط أعمال تقديري'
        },
        category: 'financial',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Promesse d’achat et demande de financement', ar: 'الوعد بالشراء وطلب المرابحة' },
        description: {
          fr: 'Choix de l’équipement par le client et signature de la promesse unilatérale d’achat.',
          ar: 'اختيار العتاد وتوقيع وعد الشراء بالفرع المصرفي.'
        }
      },
      {
        step: 2,
        title: { fr: 'Achat de l’équipement par la banque', ar: 'شراء المصرف للتجهيزات' },
        description: {
          fr: 'La banque acquiert directement le bien auprès du fournisseur désigné.',
          ar: 'يقوم المصرف باقتناء البضاعة مباشرة من المزود.'
        }
      },
      {
        step: 3,
        title: { fr: 'Revente à terme au client', ar: 'إعادة البيع بالمرابحة للباعث' },
        description: {
          fr: 'Signature du contrat de Mourabaha et livraison des équipements avec échéancier fixé.',
          ar: 'إبرام عقد المرابحة وتسليم التجهيزات مع تقسيط الثمن.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Pas de pénalités de retard sous forme d’intérêts (seules des compensations statutaires peuvent être reversées à des œuvres caritatives).',
        ar: 'لا توظف فوائض تأخير ربوية (أي مبالغ تأخير توجه لجمعيات خيرية وفق الضوابط الشرعية).'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: false,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.banquezitouna.com/entreprises/financements/mourabaha',
      sourceTitle: 'Banque Zitouna - Mourabaha Investissement Entreprises',
      sourceType: 'bank_fiche',
      dateChecked: '2026-05-19',
      verifiedFields: ['rateType', 'purposes', 'minContributionPercent', 'durationMonthsMax'],
      unverifiedFields: ['exactProfitMarginRate', 'takafulInsuranceRate'],
      notes: {
        fr: 'Formule Mourabaha vérifiée et conforme à la Charia. La marge bénéficiaire exacte est fixée lors de l’émission de l’offre d’achat selon la nature des équipements.',
        ar: 'صيغة مرابحة استثمارية معتمدة شرعياً. هامش الربح النهائي يحدد عند إعداد عرض الشراء تبعاً لنوعية المعدات.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'aneti_cheque_entreprendre',
    code: 'ANETI-CHEQUE',
    providerId: 'aneti',
    name: {
      fr: 'Chèque Entreprise & Bourse d’Accompagnement - ANETI',
      ar: 'صك المؤسسة ومنحة المرافقة - الوكالة الوطنية للتشغيل'
    },
    tagline: {
      fr: 'Financement d’études de marché, assistance technique et prime mensuelle pour jeunes créateurs.',
      ar: 'تمويل دراسات الجدوى والمساعدة الفنية مع منحة شهرية لمرافقة الباعثين الشبان.'
    },
    category: 'grant_subsidy',
    purposes: ['creation', 'innovation_rd', 'expansion'],
    minAmount: 3000,
    maxAmount: 15000,
    minContributionPercent: 0,
    rateType: 'interest_free',
    rateDescription: {
      fr: 'Subvention totale non remboursable pour financer l’assistance technique et l’incubation.',
      ar: 'منحة مجانية غير قابلة للاسترجاع لتغطية تكاليف الخبراء والمرافقة والتكوين.'
    },
    estimatedRateAnnual: 0,
    durationMonthsMin: 6,
    durationMonthsMax: 12,
    gracePeriodMonthsMin: 0,
    gracePeriodMonthsMax: 0,
    guaranteeRequirements: {
      fr: 'Aucune garantie requise.',
      ar: 'بدون أي ضمانات مطلوبة.'
    },
    targetAudience: {
      fr: 'Primo-demandeurs d’emploi et diplômés souhaitant monter leur projet et tester leur marché.',
      ar: 'طالبو الشغل لأول مرة وأصحاب الشهادات الراغبون في اختبار فكرة مشروعهم.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway'],
      sectors: ['services', 'ict_tech', 'crafts_trades', 'industry', 'tourism', 'agriculture_agribusiness'],
      allowedLegalForms: ['individual', 'suarl', 'sarl', 'not_yet_created'],
      maxAge: 40,
      otherRules: [
        {
          fr: 'Inscription préalable auprès d’un Bureau de l’Emploi et du Travail Indépendant (BETI).',
          ar: 'التسجيل بمكتب التشغيل والعمل المستقل كطالب شغل أو باعث.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'inscription_aneti',
        name: {
          fr: 'Carte d’inscription au bureau de l’emploi',
          ar: 'بطاقة التسجيل بمكتب التشغيل'
        },
        category: 'identity',
        mandatory: true
      },
      {
        id: 'fiche_idee_projet',
        name: {
          fr: 'Fiche descriptive de l’idée de projet',
          ar: 'بطاقة وصفية لفكرة المشروع'
        },
        category: 'technical_business_plan',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Inscription à l’Espace Entreprendre', ar: 'التسجيل بفضاء المبادرة' },
        description: {
          fr: 'Affectation à un conseiller en création d’entreprise.',
          ar: 'تعيين مستشار مختص في بعث المؤسسات.'
        }
      },
      {
        step: 2,
        title: { fr: 'Attribution du Chèque Entreprise', ar: 'إسناد صك المؤسسة' },
        description: {
          fr: 'Paiement direct du cabinet d’études ou de l’expert comptable pour l’étude de marché.',
          ar: 'تسديد مستحقات مكتب الدراسات أو الخبير المكلف بإعداد دراسة الجدوى.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Ne finance pas directement les machines de production, mais l’intelligence préparatoire et les frais d’études.',
        ar: 'لا يمول شراء الآلات بل مخصص للدراسات والاستشارات والتهيئة الأولية.'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.emploi.nat.tn/fo/Fr/global.php?menu1=72',
      sourceTitle: 'ANETI - Mesures d’encouragement au travail indépendant',
      sourceType: 'official_portal',
      dateChecked: '2026-04-05',
      verifiedFields: ['maxAmount', 'purposes', 'rate', 'minContributionPercent', 'durationMonths', 'targetAudience'],
      unverifiedFields: ['regionalQuota'],
      notes: {
        fr: 'Plafond d’aide à l’étude et gratuité vérifiés d’après le guide ANETI. L’attribution reste soumise à la disponibilité des quotas budgétaires du bureau d’emploi local.',
        ar: 'تم التحقق من سقف المساعدة والمجانية. الإسناد خاضع للحصة المتاحة بمكتب التشغيل والعمل المستقل.'
      },
      lastUpdateYear: 2026
    }
  },
  {
    id: 'bts_fonapram',
    code: 'FONAPRAM-BTS',
    providerId: 'bts',
    name: {
      fr: 'Fonds FONAPRAM - Petits Métiers et Artisanat',
      ar: 'صندوق النهوض بالصناعات التقليدية والمهن الصغرى (فوناكرام)'
    },
    tagline: {
      fr: 'Crédit à taux d’intérêt préférentiel pour les artisans et ateliers de métiers agréés.',
      ar: 'قرض ميسر للحرفيين وأصحاب ورشات المهن والخدمات الصغرى.'
    },
    category: 'subsidized_loan',
    purposes: ['equipment', 'working_capital', 'creation'],
    minAmount: 3000,
    maxAmount: 100000,
    minContributionPercent: 5,
    rateType: 'subsidized',
    rateDescription: {
      fr: 'Taux bonifié de 5% par an avec dotation remboursable sans intérêt pour l’apport.',
      ar: 'فائدة تفاضلية 5% سنوياً مع مساهمة قابلة للاسترجاع دون فائدة للتمويل الذاتي.'
    },
    estimatedRateAnnual: 5.0,
    durationMonthsMin: 24,
    durationMonthsMax: 84,
    gracePeriodMonthsMin: 6,
    gracePeriodMonthsMax: 18,
    guaranteeRequirements: {
      fr: 'Garantie morale et caution solidaire, sans hypothèque.',
      ar: 'كفالة تضامنية أو التزام شخصي دون رهن عقاري.'
    },
    targetAudience: {
      fr: 'Artisans détenteurs d’une carte professionnelle, diplômés de la formation professionnelle (CAP/BTP/BTS).',
      ar: 'الحرفيون الحاملون لبطاقة مهنية وخريجو التكوين المهني.'
    },
    eligibilityCriteria: {
      stages: ['idea_project', 'creation_underway', 'established_under_2y', 'established_over_2y'],
      sectors: ['crafts_trades', 'services', 'industry'],
      allowedLegalForms: ['individual', 'suarl'],
      otherRules: [
        {
          fr: 'Justifier d’une qualification professionnelle ou d’une attestation d’exercice du métier.',
          ar: 'إثبات الكفاءة المهنية أو بطاقة مهنية حرفية مسلمة من الديوان الوطني للصناعات التقليدية.'
        }
      ]
    },
    requiredDocuments: [
      {
        id: 'carte_artisan',
        name: {
          fr: 'Carte professionnelle d’artisan ou diplôme de formation professionnelle',
          ar: 'بطاقة مهنية للحرفي أو شهادة تكوين مهني'
        },
        category: 'identity',
        mandatory: true
      },
      {
        id: 'devis_outillage',
        name: {
          fr: 'Devis des équipements et de l’outillage',
          ar: 'فواتير تقديرية للأدوات والمعدات'
        },
        category: 'quotations_invoices',
        mandatory: true
      }
    ],
    applicationSteps: [
      {
        step: 1,
        title: { fr: 'Dépôt au Commissariat Régional à l’Artisanat / BTS', ar: 'إيداع الملف بالديوان أو الفرع البنكي' },
        description: {
          fr: 'Examen de la qualification et constitution du dossier technique.',
          ar: 'التثبت من الصفة الحرفية وتجهيز الملف الفني.'
        }
      },
      {
        step: 2,
        title: { fr: 'Approbation et décaissement', ar: 'المصادقة والتسليم' },
        description: {
          fr: 'Émission des bons de commande aux fournisseurs agréés.',
          ar: 'تحرير أذون الشراء للمزودين المعتمدين.'
        }
      }
    ],
    importantCaveats: [
      {
        fr: 'Plafond limité selon la nature de l’activité (artisanat d’art, métiers de services).',
        ar: 'السقف مرتبط بطبيعة النشاط ونوعية التجهيزات المعتمدة.'
      }
    ],
    hasRegionalDevelopmentBonus: false,
    accessibleWithoutHeavyCollateral: true,
    verification: {
      status: 'PARTIALLY_VERIFIED',
      sourceUrl: 'https://www.bts.com.tn/fonds-speciaux/fonapram/',
      sourceTitle: 'BTS Bank - Mécanisme FONAPRAM officiel',
      sourceType: 'bank_fiche',
      dateChecked: '2026-03-20',
      verifiedFields: ['maxAmount', 'rate', 'minContributionPercent', 'durationMonths', 'gracePeriodMonths'],
      unverifiedFields: ['guaranteeRequirements'],
      notes: {
        fr: 'Plafond (100 000 DT), taux bonifié (5%) et apport minime (5%) vérifiés d’après les textes FONAPRAM. Les cautions exigées restent à valider par le commissariat régional.',
        ar: 'تم التحقق من السقف ونسبة الفائدة والتمويل الذاتي. الضمانات الميدانية يحددها المندوب الجهوي وفرع البنك.'
      },
      lastUpdateYear: 2026
    }
  }
];

export const ALL_PROGRAM_IDS = FINANCING_PROGRAMS.map(p => p.id);
