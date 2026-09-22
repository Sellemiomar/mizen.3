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
  degreeLabel: string;
  degreeHelp: string;
  startupLabel: string;
  startupHelp: string;
  zdrLabel: string;
  zdrHelp: string;
  shariaLabel: string;
  collateralLabel: string;

  // Results
  resultsTitle: string;
  resultsSub: string;
  matchedBecauseTitle: string;
  potentialIssuesTitle: string;
  needsVerificationTitle: string;
  eligibilityLevelHigh: string;
  eligibilityLevelModerate: string;
  eligibilityLevelBlocker: string;
  viewDetailBtn: string;
  compareBtn: string;
  addToCompare: string;
  removeFromCompare: string;
  prepareDossierBtn: string;
  officialSourceBtn: string;

  // Financial
  estMonthlyPayment: string;
  totalRepayment: string;
  financingCost: string;
  gracePeriod: string;
  durationLabel: string;
  cannotCalculateReliably: string;

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
    heroHeadline: 'Trouvez les financements adaptés à votre projet en Tunisie.',
    heroSubheadline: 'BFPME, BTS, SOTUGAR, FOPRODI, Microfinance, Startup Act. Mizen analyse vos besoins réels et vérifie votre éligibilité auprès des organismes officiels.',
    heroStartBtn: 'Trouver mes financements',
    heroExploreBtn: 'Consulter l’annuaire officiel',
    heroAiIntakeTitle: 'Ou décrivez votre besoin en langage naturel :',
    heroAiIntakePlaceholder: 'Ex: J’ai besoin de 80 000 DT pour acquérir du matériel de confection textile à Sousse...',
    heroAiIntakeSubmit: 'Analyser avec Mizen AI',
    heroAiIntakeHint: 'Mizen extrait le montant, la localisation et le secteur pour pré-remplir votre analyse.',

    trustUserProvided: 'Déclaré par vous',
    trustVerifiedFact: 'Fait vérifié - Source officielle',
    trustCalculated: 'Estimation calculée',
    trustAiInterpretation: 'Analyse intelligente Gemini',

    step1Title: 'Projet & Besoin financier',
    step1Desc: 'Distinguez le coût global, votre apport personnel et le montant du prêt sollicité.',
    step2Title: 'Activité & Localisation',
    step2Desc: 'Le secteur et le gouvernorat déterminent les subventions et les bonus régionaux.',
    step3Title: 'Stade & Forme juridique',
    step3Desc: 'Les conditions diffèrent entre création, nouveau promoteur et extension.',
    step4Title: 'Critères qualifiants',
    step4Desc: 'Diplôme supérieur, statut Startup Act ou finance islamique.',

    totalCostLabel: 'Coût total du projet (TND)',
    userContributionLabel: 'Votre apport personnel (TND)',
    financingRequestedLabel: 'Financement bancaire / aide demandé (TND)',
    purposeLabel: 'Objet du financement',
    sectorLabel: 'Secteur d’activité',
    locationLabel: 'Gouvernorat d’implantation',
    stageLabel: 'Stade de l’entreprise',
    legalFormLabel: 'Forme juridique (ou envisagée)',
    degreeLabel: 'Titulaire d’un diplôme d’enseignement supérieur',
    degreeHelp: 'Ouvre les plafonds BTS jusqu’à 150 000 DT et bonifications ANETI.',
    startupLabel: 'Labellisé Startup Act (ou projet hautement innovant)',
    startupHelp: 'Éligibilité aux bourses de subsistance et fonds ANAVA.',
    zdrLabel: 'Zone d’encouragement au développement régional (ZDR)',
    zdrHelp: 'Majoration de la garantie SOTUGAR à 75% et dotations FOPRODI.',
    shariaLabel: 'Préférence pour la finance islamique (Mourabaha)',
    collateralLabel: 'Disponibilité de garanties / hypothèque',

    resultsTitle: 'Mécanismes de financement identifiés',
    resultsSub: 'Classés de manière transparente selon vos critères déclarés et les conditions officielles vérifiées.',
    matchedBecauseTitle: 'Correspondances avec votre profil :',
    potentialIssuesTitle: 'Points d’attention ou critères bloquants :',
    needsVerificationTitle: 'À vérifier avec le chargé de clientèle :',
    eligibilityLevelHigh: 'Forte adéquation avec les critères publics',
    eligibilityLevelModerate: 'Adéquation partielle — points à vérifier',
    eligibilityLevelBlocker: 'Critères potentiellement bloquants',
    viewDetailBtn: 'Voir la fiche complète',
    compareBtn: 'Comparer',
    addToCompare: 'Ajouter au comparateur',
    removeFromCompare: 'Retirer',
    prepareDossierBtn: 'Préparer mon dossier',
    officialSourceBtn: 'Consulter la source officielle',

    estMonthlyPayment: 'Mensualité estimée',
    totalRepayment: 'Remboursement total estimé',
    financingCost: 'Coût du financement',
    gracePeriod: 'Différé d’amortissement (franchise)',
    durationLabel: 'Durée de remboursement',
    cannotCalculateReliably: 'Ne peut être calculé de façon fiable à partir des informations actuellement vérifiées.',

    verifiedBadge: 'Vérifié auprès de la source officielle',
    partiallyVerifiedBadge: 'Partiellement vérifié',
    outdatedBadge: 'Information à confirmer avant dépôt',
    unverifiedBadge: 'Donnée non vérifiée',
    lastCheckedLabel: 'Dernière vérification',

    compareTitle: 'Comparatif direct des offres',
    compareEmpty: 'Sélectionnez au moins 2 options de financement pour comparer les montants, taux, garanties et conditions.',
    readinessTitle: 'Préparation & Dossier de Financement',
    readinessSub: 'Optimisez vos chances en arrivant avec un dossier complet et les bonnes questions à poser.',
    readinessScoreLabel: 'Niveau de complétude du dossier',
    docChecklistTitle: 'Pièces administratives à préparer impérativement',
    interviewQuestionsTitle: 'Questions stratégiques pour votre rendez-vous bancaire',
    officialPortal: 'Accès au portail officiel de l’organisme',
    disclaimerText: 'Avertissement : Mizen est une plateforme d’orientation et d’intelligence financière. Mizen n’est ni une banque ni un organisme de crédit, et ne garantit en aucun cas l’octroi d’un financement. Les informations sont fournies à titre indicatif et doivent être validées auprès des institutions concernées.'
  },
  ar: {
    appName: 'ميزان',
    appTagline: 'استخبارات التمويل في تونس',
    navHome: 'الرئيسية',
    navExplore: 'جميع آليات التمويل',
    navCompare: 'المقارنة',
    navDossier: 'ملفي',
    navDocScan: 'فحص الوثائق',
    heroHeadline: 'اكتشف خيارات التمويل الملائمة لمشروعك في تونس.',
    heroSubheadline: 'بنك تمويل المؤسسات، بنك التضامن، سوتوغار، فبرودي، التمويل الأصغر، ستارت آب آكت. يقوم ميزان بتحليل احتياجاتك والتحقق من أهليتك لدى الهيئات الرسمية.',
    heroStartBtn: 'ابدأ البحث عن تمويل',
    heroExploreBtn: 'تصفح الدليل الرسمي',
    heroAiIntakeTitle: 'أو صِف مشروعك باللغة الطبيعية :',
    heroAiIntakePlaceholder: 'مثال: أحتاج لحوالي 80 ألف دينار لشراء آلات خياطة لمصنع ملابس في سوسة...',
    heroAiIntakeSubmit: 'تحليل عبر ذكاء ميزان',
    heroAiIntakeHint: 'يستخرج ميزان المبلغ والولاية والقطاع لتعبئة النموذج تلقائياً وبدقة.',

    trustUserProvided: 'معلومة مصرّح بها من الباعث',
    trustVerifiedFact: 'معطى موثّق - مصدر رسمي',
    trustCalculated: 'تقدير مالي محسوب',
    trustAiInterpretation: 'تحليل ذكي عبر Gemini',

    step1Title: 'المشروع والاحتياج المالي',
    step1Desc: 'الفصل الصارم بين كلفة المشروع، تمويلك الذاتي، ومبلغ القرض المطلوب.',
    step2Title: 'النشاط والموقع الجغرافي',
    step2Desc: 'القطاع والولاية يحددان المنح وحوافز التنمية الجهوية.',
    step3Title: 'مرحلة التقدم والصيغة القانونية',
    step3Desc: 'الشروط تختلف جذرياً بين إحداث جديد أو باعث شاب أو توسعة.',
    step4Title: 'الشروط التفاضلية الخاصة',
    step4Desc: 'شهادة التعليم العالي، علامة ستارت آب آكت، أو المعاملات الإسلامية.',

    totalCostLabel: 'الكلفة الجملية للمشروع (د.ت)',
    userContributionLabel: 'تمويلك الذاتي / المساهمة الشخصية (د.ت)',
    financingRequestedLabel: 'مبلغ التمويل البنكي المطلوب (د.ت)',
    purposeLabel: 'موضوع التمويل',
    sectorLabel: 'قطاع النشاط',
    locationLabel: 'ولاية الانتصاب',
    stageLabel: 'مرحلة تقدم المشروع',
    legalFormLabel: 'الصيغة القانونية (الحالية أو المستهدفة)',
    degreeLabel: 'حامل لشهادة من التعليم العالي',
    degreeHelp: 'تفتح سقف قروض بنك التضامن حتى 150 ألف دينار ومرافقة مكاتب التشغيل.',
    startupLabel: 'متحصل على علامة مؤسسة ناشئة (Startup Act)',
    startupHelp: 'التمتع بمنحة شهرية وتدخل صناديق الاستثمار التكنولوجية.',
    zdrLabel: 'منطقة تشجيع التنمية الجهوية (ZDR)',
    zdrHelp: 'رفع نسبة ضمان سوتوغار إلى 75% والتمتع بمنح صندوق فبرودي.',
    shariaLabel: 'أفضلية التمويل الإسلامي (صيغة المرابحة)',
    collateralLabel: 'توفر رهون وضمانات عينية',

    resultsTitle: 'خيارات التمويل المطابقة لمشروعك',
    resultsSub: 'مرتبة بكل شفافية بناءً على معطياتك المصرح بها والشروط الرسمية الموثقة.',
    matchedBecauseTitle: 'نقاط التطابق مع ملفك :',
    potentialIssuesTitle: 'نقاط الانتباه أو الشروط المعطلة :',
    needsVerificationTitle: 'نقاط للتثبت المباشر مع البنك :',
    eligibilityLevelHigh: 'تطابق قوي مع المعايير العامة',
    eligibilityLevelModerate: 'تطابق جزئي — نقاط تتطلب التثبت',
    eligibilityLevelBlocker: 'معايير قد تعيق القبول الفني',
    viewDetailBtn: 'تفاصيل البرنامج الكاملة',
    compareBtn: 'مقارنة',
    addToCompare: 'إضافة للمقارنة',
    removeFromCompare: 'إلغاء',
    prepareDossierBtn: 'تجهيز ملف التمويل',
    officialSourceBtn: 'زيارة المصدر الرسمي',

    estMonthlyPayment: 'القسط الشهري التقديري',
    totalRepayment: 'إجمالي الخلاص التقديري',
    financingCost: 'كلفة التمويل الإجمالية',
    gracePeriod: 'مدة الإمهال (فترة السماح)',
    durationLabel: 'مدة السداد',
    cannotCalculateReliably: 'لا يمكن احتساب الكلفة بدقة اعتماداً على المعطيات الموثقة حالياً.',

    verifiedBadge: 'موثّق استناداً للمصدر الرسمي',
    partiallyVerifiedBadge: 'موثّق جزئياً',
    outdatedBadge: 'معلومات تستوجب التحيين قبل تقديم الملف',
    unverifiedBadge: 'معطيات غير موثقة',
    lastCheckedLabel: 'تاريخ آخر تدقيق',

    compareTitle: 'مقارنة مباشرة بين عروض التمويل',
    compareEmpty: 'اختر على الأقل آليتين لمقارنة المبالغ، نسب الفائدة، والضمانات المطلوبة.',
    readinessTitle: 'جاهزية الملف والتحضير للمقابلة',
    readinessSub: 'عزز فرص قبول ملفك بالحصول على قائمة دقيقة للوثائق وأهم الأسئلة لمسؤول البنك.',
    readinessScoreLabel: 'نسبة اكتمال الملف',
    docChecklistTitle: 'الوثائق الإدارية الواجب توفيرها وجوباً',
    interviewQuestionsTitle: 'أسئلة استراتيجية لموعدك الأول بالبنك',
    officialPortal: 'رابط البوابة الرسمية للمؤسسة',
    disclaimerText: 'تنبيه قانوني: ميزان منصة استرشادية واستخباراتية. ميزان ليس بنكاً أو مؤسسة إقراض، ولا يضمن بأي حال منح التمويل. جميع البيانات استئناسية ويجب تأكيدها لدى المؤسسات المعنية.'
  }
};
