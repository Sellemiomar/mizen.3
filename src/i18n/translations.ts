import { Language } from '../types/financing';

export interface Translations {
  appName: string;
  appTagline: string;
  navHome: string;
  navExplore: string;
  navCompare: string;
  navDossier: string;
  navDocScan: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroStartBtn: string;
  heroExploreBtn: string;
  heroAiIntakeTitle: string;
  heroAiIntakePlaceholder: string;
  heroAiIntakeSubmit: string;
  heroAiIntakeHint: string;
  heroTrustSource: string;
  heroTrustDistinction: string;
  heroTrustNoPromise: string;
  heroTrustBilingual: string;

  // How Mizen Works (3-step explanation)
  howItWorksTitle: string;
  howItWorksSub: string;
  step1CardTitle: string;
  step1CardDesc: string;
  step2CardTitle: string;
  step2CardDesc: string;
  step3CardTitle: string;
  step3CardDesc: string;
  guaranteeClarification: string;

  // Stacking & Co-financing
  stackTitle: string;
  stackSub: string;
  stackCard1Title: string;
  stackCard1Desc: string;
  stackCard2Title: string;
  stackCard2Desc: string;
  stackRuleNotice: string;

  // Transparency
  transparencyTitle: string;
  transparencySub: string;
  transpVerifiedTitle: string;
  transpVerifiedDesc: string;
  transpHistoricalTitle: string;
  transpHistoricalDesc: string;
  transpCalculatedTitle: string;
  transpCalculatedDesc: string;
  transpUnknownTitle: string;
  transpUnknownDesc: string;

  // Institutional landscape
  institutionsTitle: string;
  institutionsSub: string;

  // Demo Scenarios
  demoScenariosTitle: string;
  demoScenariosSub: string;
  demoBadge: string;
  loadDemoScenario: string;
  activeDemoNotice: string;
  clearDemoBtn: string;

  // Trust labels
  trustUserProvided: string;
  trustVerifiedFact: string;
  trustCalculated: string;
  trustAiInterpretation: string;

  // Questionnaire
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Labels
  totalCostLabel: string;
  userContributionLabel: string;
  financingRequestedLabel: string;
  purposeLabel: string;
  sectorLabel: string;
  locationLabel: string;
  stageLabel: string;
  legalFormLabel: string;
  incomeLabel: string;
  employmentLabel: string;
  propertyTypeLabel: string;
  firstHomeLabel: string;
  degreeLabel: string;
  degreeHelp: string;
  startupLabel: string;
  startupHelp: string;
  zdrLabel: string;
  zdrHelp: string;
  shariaLabel: string;
  collateralLabel: string;

  // Results & Intelligence Report
  resultsTitle: string;
  resultsSub: string;
  executiveSummaryTitle: string;
  executiveSummaryLead: string;
  whyThisResultTitle: string;
  matchedBecauseTitle: string;
  potentialIssuesTitle: string;
  needsVerificationTitle: string;
  whatIsMissingTitle: string;
  whatMizenDoesNotDetermineTitle: string;
  whatMizenDoesNotDetermineText: string;
  alignmentStrong: string;
  alignmentPartial: string;
  alignmentBlockers: string;
  viewDetailBtn: string;
  compareBtn: string;
  addToCompare: string;
  removeFromCompare: string;
  prepareDossierBtn: string;
  officialSourceBtn: string;
  lenderHandoffBtn: string;

  // Financial
  estMonthlyPayment: string;
  totalRepayment: string;
  financingCost: string;
  gracePeriod: string;
  durationLabel: string;
  cannotCalculateReliably: string;
  illustrativeEstimateNotice: string;

  // Verification badges
  verifiedBadge: string;
  partiallyVerifiedBadge: string;
  outdatedBadge: string;
  unverifiedBadge: string;
  lastCheckedLabel: string;

  // Compare & Readiness
  compareTitle: string;
  compareEmpty: string;
  readinessTitle: string;
  readinessSub: string;
  readinessScoreLabel: string;
  docChecklistTitle: string;
  interviewQuestionsTitle: string;
  officialPortal: string;
  disclaimerText: string;
  persistentDisclaimer: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    appName: 'Mizen',
    appTagline: 'Intelligence de financement pour la Tunisie',
    navHome: 'Accueil',
    navExplore: 'Tous les financements',
    navCompare: 'Comparateur',
    navDossier: 'Mon Dossier',
    navDocScan: 'Vérification Documentaire',
    heroHeadline: 'Comprenez comment votre projet peut être financé — avant d’aller voir la banque.',
    heroSubheadline: 'Mizen est un moteur d’intelligence financière pour la Tunisie. Nous analysons l’adéquation de votre projet avec les critères publics officiels, identifions les règles bloquantes et explorons les montages compatibles — sans inventer de données ni promettre d’accord.',
    heroStartBtn: 'Faire le diagnostic',
    heroExploreBtn: 'Explorer les mécanismes',
    heroAiIntakeTitle: 'Décrivez simplement votre projet en langage naturel :',
    heroAiIntakePlaceholder: 'Ex : J’ouvre un atelier de confection à Monastir. Coût estimé 200 000 DT, apport personnel 50 000 DT et je cherche un financement pour les équipements...',
    heroAiIntakeSubmit: 'Analyser avec Mizen AI',
    heroAiIntakeHint: 'Les informations manquantes ne sont pas inventées : Mizen sépare le coût global, l’apport personnel et le besoin d’emprunt.',
    heroTrustSource: 'Sources officielles vérifiées',
    heroTrustDistinction: 'Distinction faits / incertitudes',
    heroTrustNoPromise: 'Aucune promesse d’accord automatique',
    heroTrustBilingual: 'Bilingue Français & العربية',

    // How Mizen Works (3-step explanation)
    howItWorksTitle: 'Comment fonctionne l’intelligence Mizen',
    howItWorksSub: 'Une démarche méthodique pour structurer votre recherche de financement en 3 étapes clés.',
    step1CardTitle: '01. Comprendre le projet',
    step1CardDesc: 'Coût global, apport personnel, secteur, stade d’avancement, gouvernorat et nature précise des dépenses.',
    step2CardTitle: '02. Tester la compatibilité & l’éligibilité',
    step2CardDesc: 'Application des règles éliminatoires, identification des conditions bloquantes, données manquantes et niveau de preuve.',
    step3CardTitle: '03. Élaborer une stratégie de co-financement',
    step3CardDesc: 'Quand une seule source ne suffit pas, Mizen analyse les montages potentiellement compatibles (crédit + garantie SOTUGAR, dotation FOPRODI + prêt bancaire).',
    guaranteeClarification: 'Important : Les garanties (SOTUGAR) sont des instruments de couverture de risque pour le prêteur et ne constituent pas des apports de trésorerie directe.',

    // Stacking & Co-financing
    stackTitle: 'Stratégies Multi-Sources & Co-Financement',
    stackSub: 'Parfois, un seul financement ne suffit pas. Mizen évalue si plusieurs mécanismes peuvent former un montage cohérent.',
    stackCard1Title: 'Financement Unique',
    stackCard1Desc: 'Un emprunt bancaire ou un leasing direct pour couvrir un besoin ciblé dans la limite des plafonds autorisés.',
    stackCard2Title: 'Montage Structuré (Co-Financement)',
    stackCard2Desc: 'Combinaison d’un crédit d’investissement (ex. BFPME ou banque), d’une couverture de risque SOTUGAR et d’une dotation en fonds propres (FOPRODI).',
    stackRuleNotice: 'Règle d’intégrité : Mizen n’affirme la compatibilité que sur la base de textes réglementaires vérifiés. En l’absence de preuve explicite, la compatibilité reste STRICTEMENT « UNKNOWN » avec un niveau de confiance prudent.',

    // Transparency
    transparencyTitle: 'Transparence & Intégrité de la Connaissance',
    transparencySub: 'Mizen applique une séparation stricte entre les différents niveaux de certitude pour ne jamais induire l’entrepreneur en erreur.',
    transpVerifiedTitle: 'Faits vérifiés & actuels',
    transpVerifiedDesc: 'Textes de lois, décrets d’application et circulaires de la BCT en vigueur avec traçabilité complète de la source.',
    transpHistoricalTitle: 'Historique documenté',
    transpHistoricalDesc: 'Conditions et plafonds antérieurs conservés pour l’audit mais exclus des règles actives sans confirmation d’actualité.',
    transpCalculatedTitle: 'Calculs & Formules explicites',
    transpCalculatedDesc: 'Simulations financières basées sur des formules publiques. Aucune simulation n’est fabriquée si la marge ou la relation de taux est incertaine.',
    transpUnknownTitle: 'Incertitudes préservées (UNKNOWN)',
    transpUnknownDesc: 'Les paramètres non publiés ou non confirmés restent explicitement « NON PRÉCISÉ » et ne sont jamais remplacés par des zéros ou des valeurs par défaut.',

    // Institutional landscape
    institutionsTitle: 'Écosystème institutionnel et bancaire couvert',
    institutionsSub: 'Mécanismes et critères publics indexés dans la base de connaissances de Mizen (sans affiliation ni mandat d’intermédiation).',

    // Demo Scenarios
    demoScenariosTitle: 'Cas de démonstration pilotes (Données synthétiques)',
    demoScenariosSub: 'Sélectionnez un scénario réaliste pour visualiser instantanément le rapport d’intelligence Mizen :',
    demoBadge: 'Cas Démo Synthétique',
    loadDemoScenario: 'Charger ce cas démo',
    activeDemoNotice: 'Vous visualisez actuellement un cas de démonstration synthétique. Les données sont purement illustratives et n’impliquent aucun accord préalable d’une banque.',
    clearDemoBtn: 'Réinitialiser / Nouveau diagnostic',

    trustUserProvided: 'Déclaré par l’utilisateur',
    trustVerifiedFact: 'Fait vérifié — Source officielle',
    trustCalculated: 'Estimation calculée (Formule vérifiée)',
    trustAiInterpretation: 'Extraction assistée par IA',

    step1Title: 'Projet & Besoin financier',
    step1Desc: 'Distinguez le coût global, votre apport personnel et le montant du financement sollicité.',
    step2Title: 'Activité, Revenu & Localisation',
    step2Desc: 'Le secteur, la tranche de revenu et le gouvernorat déterminent l’éligibilité aux dispositifs et bonifications.',
    step3Title: 'Stade d’avancement & Forme juridique',
    step3Desc: 'Les conditions diffèrent entre création, nouveau promoteur, PME établie et projet résidentiel.',
    step4Title: 'Critères qualifiants & Préférences',
    step4Desc: 'Diplôme de l’enseignement supérieur, labellisation Startup Act ou préférence éthique.',

    totalCostLabel: 'Coût global du projet ou du bien (TND)',
    userContributionLabel: 'Votre apport personnel déclaré (TND)',
    financingRequestedLabel: 'Financement bancaire / aide sollicité (TND)',
    purposeLabel: 'Objet du financement',
    sectorLabel: 'Secteur d’activité',
    locationLabel: 'Gouvernorat d’implantation / bien',
    stageLabel: 'Stade de l’entreprise / avancement',
    legalFormLabel: 'Forme juridique (ou envisagée)',
    incomeLabel: 'Tranche de revenu net mensuel du foyer',
    employmentLabel: 'Statut professionnel / Situation',
    propertyTypeLabel: 'Type de bien immobilier (Habitat)',
    firstHomeLabel: 'Premier achat immobilier (Primo-accédant non propriétaire)',
    degreeLabel: 'Titulaire d’un diplôme d’enseignement supérieur',
    degreeHelp: 'Ouvre les plafonds BTS jusqu’à 150 000 DT et bonifications ANETI.',
    startupLabel: 'Labellisé Startup Act (ou projet hautement innovant)',
    startupHelp: 'Éligibilité aux bourses de subsistance et fonds ANAVA.',
    zdrLabel: 'Implantation en Zone de Développement Régional (ZDR)',
    zdrHelp: 'Garantie SOTUGAR majorée à 75% et dotations / primes FOPRODI en région.',
    shariaLabel: 'Préférence pour la finance islamique (Mourabaha sans intérêts)',
    collateralLabel: 'Disponibilité de garanties réelles / hypothèques',

    resultsTitle: 'Rapport d’Intelligence Financière',
    resultsSub: 'Analyse transparente d’adéquation technique basée sur les critères publics officiels déclarés.',
    executiveSummaryTitle: 'Synthèse Exécutive Mizen',
    executiveSummaryLead: 'Sur la base des informations déclarées, Mizen a identifié les mécanismes de financement potentiellement pertinents suivants :',
    whyThisResultTitle: 'Pourquoi ce résultat ? (Grille de transparence)',
    matchedBecauseTitle: 'Critères déclarés en adéquation :',
    potentialIssuesTitle: 'Points d’attention ou écarts identifiés :',
    needsVerificationTitle: 'Éléments devant être confirmés avec le chargé d’affaires :',
    whatIsMissingTitle: 'Ce qui manque pour formaliser le dossier :',
    whatMizenDoesNotDetermineTitle: 'Ce que Mizen ne détermine PAS (Limites de l’outil)',
    whatMizenDoesNotDetermineText: 'Mizen est un outil d’orientation et d’aide à la décision. Il ne détermine pas l’octroi du crédit, l’accord d’éligibilité finale, la solvabilité sous les règles prudentielles du prêteur, la décision du comité d’engagement, la tarification définitive ou l’émission formelle d’une garantie.',
    alignmentStrong: 'Forte adéquation avec les critères publics',
    alignmentPartial: 'Adéquation partielle — points à valider',
    alignmentBlockers: 'Critères potentiellement bloquants',
    viewDetailBtn: 'Détails & Provenance',
    compareBtn: 'Comparer',
    addToCompare: 'Ajouter au comparateur',
    removeFromCompare: 'Retirer',
    prepareDossierBtn: 'Préparer mon dossier',
    officialSourceBtn: 'Consulter la source officielle',
    lenderHandoffBtn: 'Transmettre au prêteur (Simulation Pilote)',

    estMonthlyPayment: 'Échéance mensuelle indicative',
    totalRepayment: 'Remboursement total estimé',
    financingCost: 'Coût brut du crédit',
    gracePeriod: 'Période de grâce (différé)',
    durationLabel: 'Durée de remboursement',
    cannotCalculateReliably: 'Simulation chiffrée indisponible : le taux ou la marge commerciale doivent être arrêtés avec votre agence.',
    illustrativeEstimateNotice: 'Estimation purement illustrative basée sur les hypothèses réglementaires vérifiées. Ne constitue en aucun cas une offre commerciale ou un engagement contractuel d’un établissement de crédit.',

    verifiedBadge: 'Vérifié officiel',
    partiallyVerifiedBadge: 'Partiellement vérifié',
    outdatedBadge: 'À actualiser avant dépôt',
    unverifiedBadge: 'À confirmer en agence',
    lastCheckedLabel: 'Dernier audit de conformité',

    compareTitle: 'Comparateur de Dispositifs',
    compareEmpty: 'Sélectionnez au moins 2 mécanismes de financement pour comparer les conditions, garanties et traçabilité.',
    readinessTitle: 'Préparation du Dossier & Checklist Bancaire',
    readinessSub: 'Distinguez les informations actuellement renseignées des justificatifs et pièces que le prêteur exigera lors de l’instruction.',
    readinessScoreLabel: 'Niveau d’exhaustivité préliminaire',
    docChecklistTitle: 'Pièces requises selon les fiches officielles',
    interviewQuestionsTitle: 'Questions clés à poser à votre chargé d’affaires',
    officialPortal: 'Portail officiel de l’institution',
    disclaimerText: 'Mizen évalue l’adéquation technique avec les critères publics déclarés et ne constitue pas un accord de crédit, une promesse de financement ou une décision de comité.',
    persistentDisclaimer: 'Mizen fournit une analyse d’intelligence financière à titre informatif sur la base des critères et sources publics disponibles. Il n’approuve aucun financement, ne garantit aucune éligibilité et ne remplace pas l’instruction prudentielle des établissements bancaires et prêteurs.'
  },
  ar: {
    appName: 'ميزان',
    appTagline: 'استخبارات التمويل في تونس',
    navHome: 'الرئيسية',
    navExplore: 'جميع آليات التمويل',
    navCompare: 'المقارنة',
    navDossier: 'ملفي',
    navDocScan: 'فحص الوثائق',
    heroHeadline: 'افهم كيف يمكن تمويل مشروعك — قبل التوجه إلى البنك.',
    heroSubheadline: 'ميزان هو محرك استخبارات التمويل في تونس. يحلل ملاءمة مشروعكم مع المعايير والشروط الرسمية، ويحدد النقاط المعيقة ويستكشف آليات التمويل المتكاملة — دون اختلاق معطيات أو تقديم وعود زائفة بالموافقة.',
    heroStartBtn: 'بدء التشخيص المالي',
    heroExploreBtn: 'استكشاف آليات التمويل',
    heroAiIntakeTitle: 'صِف مشروعك بكل بساطة باللغة الطبيعية :',
    heroAiIntakePlaceholder: 'مثال : أريد فتح ورشة خياطة في المنستير بكلفة تقديرية 200 ألف دينار، ومساهمة ذاتية بـ 50 ألف دينار وأبحث عن تمويل لاقتناء الآلات والمعدات...',
    heroAiIntakeSubmit: 'تحليل عبر ذكاء ميزان',
    heroAiIntakeHint: 'المعلومات الناقصة لا يتم اختلاقها : يفصل ميزان بدقة بين الكلفة الإجمالية والتمويل الذاتي والمبلغ المطلوب.',
    heroTrustSource: 'مصادر رسمية موثقة وقانونية',
    heroTrustDistinction: 'تمييز دقيق بين الوقائع ونقاط التثبت',
    heroTrustNoPromise: 'دون أي وعود زائفة بالموافقة التلقائية',
    heroTrustBilingual: 'ثنائي اللغة بالعربية والفرنسية',

    // How Mizen Works (3-step explanation)
    howItWorksTitle: 'كيف يعمل ذكاء ميزان للتمويل',
    howItWorksSub: 'منهجية ثلاثية واضحة وموثوقة لهيكلة احتياجاتك التمويلية.',
    step1CardTitle: '01. استيعاب معطيات المشروع',
    step1CardDesc: 'الكلفة الجملية، المساهمة الذاتية، قطاع النشاط، مرحلة التقدم، ولاية الانتصاب وطبيعة النفقات المؤهلة.',
    step2CardTitle: '02. فحص الملاءمة والأهلية الفنية',
    step2CardDesc: 'تطبيق الشروط الإقصائية، رصد المعايير المعيقة، حصر المعطيات الناقصة وتحديد درجة التوثيق القانوني.',
    step3CardTitle: '03. صياغة استراتيجية التمويل والتركيبات',
    step3CardDesc: 'عندما لا يكفي مصدر واحد، يدرس ميزان التركيبات الممكنة والمتوافقة (قرض استثمار + كفالة سوتوغار، أو منحة فبرودي + قرض بنكي).',
    guaranteeClarification: 'تنبيه هام : آليات الضمان والكفالة (مثل سوتوغار) هي أدوات لتغطية مخاطر القرض بالنسبة للبنك وليست مبالغ سيولة تمنح للباعث.',

    // Stacking & Co-financing
    stackTitle: 'استراتيجيات التمويل المتعدد والتركيبات المتكاملة',
    stackSub: 'في كثير من الأحيان، لا تكفي آلية واحدة. يقيّم ميزان ما إذا كانت عدة مصادر تمويلية قابلة للجمع وفق النصوص القانونية.',
    stackCard1Title: 'التمويل الأحادي المباشر',
    stackCard1Desc: 'قرض بنكي أو إيجار مالي مباشر لتغطية احتياج محدد ضمن السقف الفردي المسموح به.',
    stackCard2Title: 'التركيبة التمويلية المتكاملة (Co-Financement)',
    stackCard2Desc: 'الجمع بين قرض استثماري متوسط/طويل المدى (BFPME أو بنك تجاري) مع تغطية مخاطر سوتوغار ومنحة في الأموال الذاتية (FOPRODI).',
    stackRuleNotice: 'مبدأ النزاهة : لا يؤكد ميزان التوافق بين الآليات إلا استناداً لنصوص وقوانين رسمية منشورة. وعند غياب الإثبات، تبقى الحالة حصراً « UNKNOWN » بمستوى ثقة حذر.',

    // Transparency
    transparencyTitle: 'ميثاق الشفافية ونزاهة المعرفة المالية',
    transparencySub: 'يعتمد ميزان فصلاً صارماً بين مستويات اليقين لضمان عدم تضليل الباعث أو المغامرة بمعطيات غير مؤكدة.',
    transpVerifiedTitle: 'معطيات موثقة وسارية المفعول',
    transpVerifiedDesc: 'نصوص قوانين ومراسيم تنفيذية ومناشير البنك المركزي السارية مع التوثيق الكامل للمصدر وتاريخ الاسترجاع.',
    transpHistoricalTitle: 'سجل تاريخي موثق',
    transpHistoricalDesc: 'شروط وسقوف سابقة محفوظة لأغراض التدقيق والمقارنة، ومستبعدة من القواعد النشطة دون تأكيد سريانها الحالي.',
    transpCalculatedTitle: 'حسابات وصيغ مالية شفافة',
    transpCalculatedDesc: 'محاكاة مالية مبنية على معادلات واضحة. ولا يتم توليد أي جدول سداد في حال كان الهامش أو النسبة غير محددة بدقة.',
    transpUnknownTitle: 'الحفاظ على المعطيات غير المحددة (UNKNOWN)',
    transpUnknownDesc: 'الشروط غير المنشورة أو غير المؤكدة تبقى صراحة « غير محدد » ولا يتم أبداً تحويلها إلى أصفار أو فرض معطيات افتراضية.',

    // Institutional landscape
    institutionsTitle: 'المنظومة المؤسساتية والبنكية المشمولة بالتغطية',
    institutionsSub: 'الآليات والمعايير العامة المفهرسة في قاعدة معرفة ميزان (دون أي ادعاء تمثيل أو توكيل بنكي).',

    // Demo Scenarios
    demoScenariosTitle: 'حالات تجريبية نموذجية للشركاء والبنوك (معطيات اصطناعية)',
    demoScenariosSub: 'اختر حالة واقعية للاطلاع الفوري على تقرير استخبارات التمويل لميزان :',
    demoBadge: 'حالة تجريبية نموذجية',
    loadDemoScenario: 'تحميل هذه الحالة التجريبية',
    activeDemoNotice: 'أنتم تتصفحون حالياً معطيات حالة تجريبية نموذجية. البيانات لأغراض العرض والتوضيح ولا تعني أي موافقة مسبقة من أي بنك.',
    clearDemoBtn: 'إعادة ضبط / تشخيص جديد',

    trustUserProvided: 'معلومة مصرّح بها من الباعث',
    trustVerifiedFact: 'معطى موثّق — مصدر رسمي',
    trustCalculated: 'تقدير مالي محسوب وفق صيغة موثقة',
    trustAiInterpretation: 'استخراج ذكي للمعطيات',

    step1Title: 'المشروع والاحتياج المالي',
    step1Desc: 'الفصل الصارم بين كلفة المشروع، تمويلك الذاتي، ومبلغ التمويل المطلوب.',
    step2Title: 'النشاط والدخل والموقع الجغرافي',
    step2Desc: 'القطاع وشريحة الدخل والولاية تحدد الأهلية والحوافز الجهوية.',
    step3Title: 'مرحلة التقدم والصيغة القانونية',
    step3Desc: 'الشروط تختلف بين الإحداث الجديد، الباعث الشاب، المؤسسة القائمة، والمشاريع السكنية.',
    step4Title: 'الشروط التفاضلية الخاصة والأولويات',
    step4Desc: 'شهادة التعليم العالي، علامة ستارت آب آكت، أو المعاملات المتوافقة مع الشريعة.',

    totalCostLabel: 'الكلفة الجملية للمشروع أو العقار (د.ت)',
    userContributionLabel: 'تمويلك الذاتي / المساهمة الشخصية (د.ت)',
    financingRequestedLabel: 'مبلغ التمويل البنكي المطلوب (د.ت)',
    purposeLabel: 'موضوع التمويل',
    sectorLabel: 'قطاع النشاط',
    locationLabel: 'ولاية الانتصاب / العقار',
    stageLabel: 'مرحلة تقدم المشروع',
    legalFormLabel: 'الصيغة القانونية (الحالية أو المستهدفة)',
    incomeLabel: 'شريحة الدخل الشهري الصافي للأسرة',
    employmentLabel: 'الوضعية المهنية للمترشح',
    propertyTypeLabel: 'نوع العقار المستهدف (التمويل السكني)',
    firstHomeLabel: 'اقتناء مسكن لأول مرة (غير مالك لمسكن سابق)',
    degreeLabel: 'حامل لشهادة من التعليم العالي',
    degreeHelp: 'تفتح سقف قروض بنك التضامن حتى 150 ألف دينار ومرافقة مكاتب التشغيل.',
    startupLabel: 'متحصل على علامة مؤسسة ناشئة (Startup Act)',
    startupHelp: 'التمتع بمنحة شهرية وتدخل صناديق الاستثمار التكنولوجية.',
    zdrLabel: 'الانتصاب بمنطقة تشجيع التنمية الجهوية (ZDR)',
    zdrHelp: 'رفع نسبة ضمان سوتوغار إلى 75% والتمتع بمنح صندوق فبرودي.',
    shariaLabel: 'أفضلية التمويل الإسلامي (صيغة المرابحة)',
    collateralLabel: 'توفر رهون وضمانات عينية',

    resultsTitle: 'تقرير استخبارات التمويل',
    resultsSub: 'تحليل دقيق وشفاف للأهلية الفنية استناداً إلى المعايير العامة المنشورة رسمياً.',
    executiveSummaryTitle: 'الملخص التنفيذي لميزان',
    executiveSummaryLead: 'بناءً على المعطيات المصرح بها، حدد ميزان آليات التمويل التالية التي قد تتلاءم مع وضعيتكم :',
    whyThisResultTitle: 'لماذا هذه النتيجة ؟ (شبكة الشفافية والتعليل)',
    matchedBecauseTitle: 'المعايير المتطابقة مع ملفكم :',
    potentialIssuesTitle: 'نقاط الانتباه أو الفوارق الفنية المحددة :',
    needsVerificationTitle: 'معطيات تستوجب التأكيد المباشر مع مسؤول التمويل بالفرع :',
    whatIsMissingTitle: 'المعطيات الناقصة لاستكمال الملف :',
    whatMizenDoesNotDetermineTitle: 'ما لا يحدده ميزان (حدود نطاق المنصة)',
    whatMizenDoesNotDetermineText: 'ميزان منصة استخباراتية لمساندة القرار. لا يقرر ميزان منح القرض، أو الموافقة النهائية على الأهلية، أو الملاءة المالية وفق القواعد الاحترازية للبنك، أو قرار لجنة التمويل، أو التسعير النهائي، أو إصدار شهادة الضمان.',
    alignmentStrong: 'تطابق قوي مع المعايير العامة',
    alignmentPartial: 'تطابق جزئي — نقاط تتطلب التثبت',
    alignmentBlockers: 'معايير قد تعيق القبول الفني',
    viewDetailBtn: 'التفاصيل والتوثيق',
    compareBtn: 'مقارنة',
    addToCompare: 'إضافة للمقارنة',
    removeFromCompare: 'إلغاء',
    prepareDossierBtn: 'تجهيز ملف التمويل',
    officialSourceBtn: 'زيارة المصدر الرسمي',
    lenderHandoffBtn: 'إحالة الملف للمؤسسة المالية (محاكاة نموذجية)',

    estMonthlyPayment: 'القسط الشهري التقديري',
    totalRepayment: 'إجمالي الخلاص التقديري',
    financingCost: 'كلفة التمويل الإجمالية',
    gracePeriod: 'مدة الإمهال (فترة السماح)',
    durationLabel: 'مدة السداد',
    cannotCalculateReliably: 'المحاكاة الرقمية معلقة : يجب تأكيد النسبة أو الهامش التجاري لدى فرع البنك.',
    illustrativeEstimateNotice: 'تقدير استئناسي محض مبني على المعطيات القانونية الموثقة. لا يشكل بأي حال عرضاً بنكياً ملزماً أو التزاماً تعاقدياً من أي مؤسسة مالية.',

    verifiedBadge: 'موثّق رسمياً',
    partiallyVerifiedBadge: 'موثّق جزئياً',
    outdatedBadge: 'يستوجب التحيين قبل التقديم',
    unverifiedBadge: 'يخضع للتأكيد بالفرع',
    lastCheckedLabel: 'تاريخ آخر تدقيق رسمي',

    compareTitle: 'مقارنة آليات التمويل',
    compareEmpty: 'اختر على الأقل آليتين لمقارنة المبالغ، نسب الفائدة، والضمانات المطلوبة.',
    readinessTitle: 'جاهزية الملف والقائمة التدقيقية للبنك',
    readinessSub: 'فصل واضح بين المعطيات المتوفرة حالياً والوثائق الرسمية التي ستطلبها المؤسسة المالية أثناء دراسة الملف.',
    readinessScoreLabel: 'نسبة اكتمال الملف الأولية',
    docChecklistTitle: 'الوثائق الرسمية المطلوبة حسب الدليل',
    interviewQuestionsTitle: 'أسئلة رئيسية لموعدكم مع مسؤول الفرع',
    officialPortal: 'رابط البوابة الرسمية للمؤسسة',
    disclaimerText: 'يحلل ميزان الملاءمة الفنية مع المعايير الرسمية ولا يشكل موافقة بنكية أو ضماناً لمنح التمويل.',
    persistentDisclaimer: 'يقدم ميزان تحليلاً استخباراتياً للتمويل لأغراض إعلامية استناداً للمعايير والمصادر الرسمية المتاحة. ولا يوافق على التمويل أو يضمن الأهلية أو يعوض الدراسة الائتمانية للمؤسسات البنكية.'
  }
};
