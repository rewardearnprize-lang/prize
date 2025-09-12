import { useState, useCallback } from 'react';

export type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations:  Record<string, { ar: string; en: string }> = {
  // Header
  'site.title': {
    ar: 'اربح جوائز مذهلة',
    en: 'Win Amazing Prizes'
  },
  'site.subtitle': {
    ar: 'شارك في السحوبات المجانية واحصل على فرصة للفوز بأحدث الأجهزة والجوائز النقدية',
    en: 'Participate in free giveaways and get a chance to win the latest devices and cash prizes'
  },
  'stats.participants': {
    ar: 'مشارك',
    en: 'Participants'
  },
  'stats.winners': {
    ar: 'فائز',
    en: 'Winners'
  },
  'stats.prizeValue': {
    ar: 'قيمة الجوائز',
    en: 'Prize Value'
  },
  'stats.continuous': {
    ar: 'سحوبات مستمرة',
    en: 'Continuous Draws'
  },
  // Prizes
  'prizes.availableNow': {
    ar: 'الجوائز المتاحة الآن',
    en: 'Prizes Available Now'
  },
  'prizes.chooseToParticipate': {
    ar: 'اختر الجائزة التي تريد المشاركة في السحب عليها',
    en: 'Choose the prize you want to participate in the draw for'
  },
  'prizes.participantsRemaining': {
    ar: 'المشاركات المتبقية',
    en: 'Remaining Participants'
  },
  'prizes.drawWhenComplete': {
    ar: 'السحب عند اكتمال',
    en: 'Draw when'
  },
  'prizes.participant': {
    ar: 'مشارك',
    en: 'participants complete'
  },
  'prizes.completed': {
    ar: 'مكتمل - جاري التحضير للسحب',
    en: 'Completed - Preparing for draw'
  },
  'button.participateInDraw': {
    ar: 'شارك في السحب',
    en: 'Participate in Draw'
  },
  'button.completed': {
    ar: 'مكتمل',
    en: 'Completed'
  },
  // Social Media
  'social.followUs': {
    ar: 'تابعنا على وسائل التواصل',
    en: 'Follow Us on Social Media'
  },
  'social.getUpdates': {
    ar: 'احصل على التحديثات الفورية وفرص إضافية للفوز',
    en: 'Get instant updates and additional chances to win'
  },
  'social.telegram': {
    ar: 'انضم لقناة تليجرام',
    en: 'Join Telegram Channel'
  },
  'social.facebook': {
    ar: 'تابعنا على فيسبوك',
    en: 'Follow on Facebook'
  },
  'social.instagram': {
    ar: 'تابعنا على إنستاجرام',
    en: 'Follow on Instagram'
  },
  // Draw Countdown

  'countdown.days': {
    ar: 'يوم',
    en: 'Days'
  },
  'countdown.hours': {
    ar: 'ساعة',
    en: 'Hours'
  },
  'countdown.minutes': {
    ar: 'دقيقة',
    en: 'Minutes'
  },
  'countdown.seconds': {
    ar: 'ثانية',
    en: 'Seconds'
  },
  'countdown.automatic': {
    ar: 'السحب يتم تلقائيًا عند انتهاء الوقت أو اكتمال العدد المطلوب',
    en: 'Draw happens automatically when time ends or required number is reached'
  },
  // Transparency
  'transparency.title': {
    ar: 'كيف يتم اختيار الفائزين؟',
    en: 'How are winners selected?'
  },
  'transparency.proof': {
    ar: 'إثبات السحب',
    en: 'Draw Proof'
  },
  'transparency.description': {
    ar: 'جميع الفائزين حقيقيون ويتم الإعلان عنهم فور إجراء السحب. نحن نؤمن بالشفافية الكاملة ونشارك إثباتات تسليم الجوائز',
    en: 'All winners are real and are announced immediately after the draw. We believe in full transparency and share proof of prize delivery'
  },
  'transparency.liveVideo': {
    ar: 'فيديو مباشر',
    en: 'Live Video'
  },
  'transparency.recorded': {
    ar: 'فيديو مسجل',
    en: 'Recorded Video'
  },
  'transparency.verification': {
    ar: 'التحقق',
    en: 'Verification'
  },
  'transparency.randomAlgorithm': {
    ar: 'خوارزمية عشوائية',
    en: 'Random Algorithm'
  },
  'transparency.documentation': {
    ar: 'التوثيق',
    en: 'Documentation'
  },
  'transparency.completeRecords': {
    ar: 'سجلات كاملة',
    en: 'Complete Records'
  },
  'transparency.security': {
    ar: 'الأمان',
    en: 'Security'
  },
  'transparency.secureData': {
    ar: 'بيانات آمنة',
    en: 'Secure Data'
  },
  // Registration
  'registration.startNow': {
    ar: 'ابدأ المشاركة الآن',
    en: 'Start Participating Now'
  },
  'registration.description': {
    ar: 'أدخل بريدك الإلكتروني وأكمل عرضًا واحدًا للمشاركة في جميع السحوبات',
    en: 'Enter your email and complete one offer to participate in all draws'
  },
  'email.placeholder': {
    ar: 'أدخل بريدك الإلكتروني',
    en: 'Enter your email address'
  },
  'button.subscribeNow': {
    ar: 'اشترك مجانًا',
    en: 'Subscribe for Free'
  },
  'registration.guarantee': {
    ar: 'مجاني 100% • لا توجد رسوم خفية • سحوبات عادلة وشفافة',
    en: '100% Free • No Hidden Fees • Fair and Transparent Draws'
  },
  // Winners
  'winners.title': {
    ar: 'قائمة الفائزين',
    en: 'Winners List'
  },
  'winners.subtitle': {
    ar: 'جميع الفائزين حقيقيون ومؤكدون مع إثباتات الاستلام',
    en: 'All winners are real and verified with delivery proofs'
  },
  'winners.winner': {
    ar: 'الفائز:',
    en: 'Winner:'
  },
  'winners.delivered': {
    ar: 'تم تسليم الجائزة بنجاح',
    en: 'Prize delivered successfully'
  },
  'winners.transparency': {
    ar: 'شفافية كاملة',
    en: 'Complete Transparency'
  },
  'winners.fairDraw': {
    ar: 'سحب عادل',
    en: 'Fair Draw'
  },
  'winners.randomAlgorithm': {
    ar: 'خوارزمية عشوائية',
    en: 'Random Algorithm'
  },
  'winners.guaranteedDelivery': {
    ar: 'تسليم مضمون',
    en: 'Guaranteed Delivery'
  },
  'winners.deliveryTime': {
    ar: 'خلال 3-5 أيام',
    en: 'Within 3-5 days'
  },
  'winners.regularProofs': {
    ar: 'إثباتات دورية',
    en: 'Regular Proofs'
  },
  'winners.weeklyUpdate': {
    ar: 'تحديث أسبوعي',
    en: 'Weekly Update'
  },
  'winners.description': {
    ar: 'جميع الفائزين حقيقيون ويتم الإعلان عنهم فور إجراء السحب. نحن نؤمن بالشفافية الكاملة ونشارك إثباتات تسليم الجوائز.',
    en: 'All winners are real and announced immediately after the draw. We believe in complete transparency and share proof of prize delivery.'
  },
  // Participation Status
  'participation.yourStatus': {
    ar: 'حالة مشاركاتك',
    en: 'Your Participation Status'
  },
  'participation.qualified': {
    ar: 'مؤهل للسحب',
    en: 'Qualified for Draw'
  },
  'participation.pending': {
    ar: 'بانتظار التحقق',
    en: 'Pending Verification'
  },
  'participation.failed': {
    ar: 'لم يكتمل العرض',
    en: 'Offer Not Completed'
  }
  ,
  // Draw Proof translations
  'proof.drawProof': {
    ar: 'إثبات السحب',
    en: 'Draw Proof'
  },
  'proof.verified': {
    ar: 'موثق',
    en: 'Verified'
  },
  'proof.video': {
    ar: 'فيديو السحب',
    en: 'Draw Video'
  },
  'proof.image': {
    ar: 'صورة السحب',
    en: 'Draw Image'
  },
  'proof.document': {
    ar: 'وثيقة السحب',
    en: 'Draw Document'
  },
  'proof.unknown': {
    ar: 'غير محدد',
    en: 'Unknown'
  },
  'proof.viewProof': {
    ar: 'عرض الإثبات',
    en: 'View Proof'
  },
  
  // Admin Panel translations
  'admin.title': {
    ar: 'لوحة الإدارة',
    en: 'Admin Panel'
  },
  'admin.subtitle': {
    ar: 'إدارة المشاركين والإحصائيات',
    en: 'Manage participants and statistics'
  },
  'admin.totalParticipants': {
    ar: 'إجمالي المشاركين',
    en: 'Total Participants'
  },
  'admin.completedOffers': {
    ar: 'العروض المكتملة',
    en: 'Completed Offers'
  },
  'admin.conversionRate': {
    ar: 'معدل التحويل',
    en: 'Conversion Rate'
  },
  'admin.totalPrizes': {
    ar: 'إجمالي الجوائز',
    en: 'Total Prizes'
  },
  'admin.participants': {
    ar: 'المشاركون',
    en: 'Participants'
  },
  'admin.offerStats': {
    ar: 'إحصائيات العروض',
    en: 'Offer Statistics'
  },
  'admin.privacy': {
    ar: 'الخصوصية',
    en: 'Privacy'
  },
  'admin.participantsList': {
    ar: 'قائمة المشاركين',
    en: 'Participants List'
  },
  'admin.email': {
    ar: 'البريد الإلكتروني',
    en: 'Email'
  },
  'admin.prize': {
    ar: 'الجائزة',
    en: 'Prize'
  },
  'admin.status': {
    ar: 'الحالة',
    en: 'Status'
  },
  'admin.joinDate': {
    ar: 'تاريخ الانضمام',
    en: 'Join Date'
  },
  'admin.actions': {
    ar: 'الإجراءات',
    en: 'Actions'
  },
  'admin.completed': {
    ar: 'مكتمل',
    en: 'Completed'
  },
  'admin.pending': {
    ar: 'في الانتظار',
    en: 'Pending'
  },
  'admin.failed': {
    ar: 'فشل',
    en: 'Failed'
  },
  'admin.viewDetails': {
    ar: 'عرض التفاصيل',
    en: 'View Details'
  },
  'admin.offerPerformance': {
    ar: 'أداء العروض',
    en: 'Offer Performance'
  },
  'admin.completions': {
    ar: 'إكمال',
    en: 'completions'
  },
  'admin.privacyCompliance': {
    ar: 'الامتثال للخصوصية',
    en: 'Privacy Compliance'
  },
  'admin.exportData': {
    ar: 'تصدير البيانات',
    en: 'Export Data'
  },
  'admin.deleteUserData': {
    ar: 'حذف بيانات المستخدم',
    en: 'Delete User Data'
  },
  'admin.gdprCompliant': {
    ar: 'متوافق مع GDPR',
    en: 'GDPR Compliant'
  },
  'admin.dataEncrypted': {
    ar: 'البيانات مشفرة',
    en: 'Data Encrypted'
  },
  'admin.regularBackups': {
    ar: 'نسخ احتياطية منتظمة',
    en: 'Regular Backups'
  },
  
  // Footer translations
  'footer.about': {
    ar: 'حول الموقع',
    en: 'About Us'
  },
  'footer.description': {
    ar: 'منصة موثوقة للمسابقات والجوائز مع ضمان الشفافية والعدالة في جميع السحوبات.',
    en: 'Trusted platform for contests and prizes with guaranteed transparency and fairness in all draws.'
  },
  'footer.legal': {
    ar: 'الشؤون القانونية',
    en: 'Legal'
  },
  'footer.privacy': {
    ar: 'سياسة الخصوصية',
    en: 'Privacy Policy'
  },
  'footer.terms': {
    ar: 'شروط المشاركة',
    en: 'Terms of Service'
  },
  'footer.dataProtection': {
    ar: 'حماية البيانات',
    en: 'Data Protection'
  },
  'footer.contact': {
    ar: 'تواصل معنا',
    en: 'Contact Us'
  },
  'footer.support': {
    ar: 'الدعم الفني',
    en: 'Support'
  },
  'footer.business': {
    ar: 'الأعمال',
    en: 'Business'
  },
  'footer.allRights': {
    ar: 'جميع الحقوق محفوظة',
    en: 'All rights reserved'
  },
  'footer.fairPlay': {
    ar: 'لعب عادل ونزيه',
    en: 'Fair and honest play'
  },
  
  // Modal translations
  'modal.close': {
    ar: 'إغلاق',
    en: 'Close'
  },
  'modal.confirm': {
    ar: 'تأكيد',
    en: 'Confirm'
  },
  'modal.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
    // ParticipationSuccessModal additional translations
    'participation.congratulations': {
      ar: 'تهانينا!',
      en: 'Congratulations!'
    },
    'participation.confirmed': {
      ar: 'تم تأكيد مشاركتك بنجاح',
      en: 'Your participation has been confirmed successfully'
    },
    'participation.details': {
      ar: 'تفاصيل مشاركتك',
      en: 'Your Participation Details'
    },
    'participation.nextSteps': {
      ar: 'الخطوات التالية',
      en: 'Next Steps'
    },
    'participation.followSocial': {
      ar: 'تابع قنواتنا الاجتماعية لتصلك النتائج فور إعلانها + احصل على فرص إضافية للفوز!',
      en: 'Follow our social channels to get results as soon as they are announced + get additional chances to win!'
    },
    'participation.followForBonus': {
      ar: 'تابع قنواتنا واحصل على فرص إضافية',
      en: 'Follow our channels and get additional chances'
    },
    'participation.backToSite': {
      ar: 'العودة للموقع',
      en: 'Back to Site'
    },
    'participation.emailNotification': {
      ar: 'ستتلقى إشعارًا عبر البريد الإلكتروني عند إعلان النتائج',
      en: 'You will receive an email notification when results are announced'
    },
    // Offers Section
  "offers.title": { ar: "العروض المتاحة", en: "Available Offers" },
  "offers.subtitle": {
    ar: "أكمل أي عرض من العروض التالية للحصول على نقاط والمشاركة في السحوبات",
    en: "Complete any of the following offers to earn points and join raffles",
  },
  "offers.limited": {
    ar: "العروض محدودة الكمية - اشترك الآن!",
    en: "Limited offers – Join now!",
  },

  // Status
  "status.completed": { ar: "مكتمل", en: "Completed" },
  "status.endingSoon": { ar: "ينتهي قريبًا", en: "Ending Soon" },
  "status.available": { ar: "متاح", en: "Available" },

  // Labels
  "label.reward": { ar: "المكافأة:", en: "Reward:" },
  "label.estimatedTime": { ar: "الوقت المقدر:", en: "Estimated Time:" },
  "label.requirements": { ar: "المتطلبات:", en: "Requirements:" },

  // Buttons
  "button.startOffer": { ar: "ابدأ العرض", en: "Start Offer" },

  // Toasts
  "toast.offerCompleted.title": { ar: "العرض مكتمل", en: "Offer Completed" },
  "toast.offerCompleted.desc": {
    ar: "لقد وصل هذا العرض للحد الأقصى من المشاركات",
    en: "This offer has reached the maximum number of participants",
  },
  "toast.redirecting.title": { ar: "جاري التوجيه...", en: "Redirecting..." },
  "toast.redirecting.desc": {
    ar: "سيتم توجيهك إلى العرض. أكمل المهام المطلوبة للحصول على النقاط.",
    en: "You’ll be redirected to the offer. Complete the tasks to earn points.",
  },
  "toast.offerOpened.title": { ar: "تم فتح العرض", en: "Offer Opened" },
  "toast.offerOpened.desc": {
    ar: "أكمل المهام المطلوبة وسيتم إضافة النقاط تلقائيًا",
    en: "Complete the required tasks and points will be added automatically",
  },

  // How it works
  "howItWorks.title": { ar: "كيف يعمل النظام؟", en: "How it Works?" },
  "howItWorks.step1.title": { ar: "اختر عرضًا", en: "Choose an Offer" },
  "howItWorks.step1.desc": { ar: "اختر من العروض المتاحة", en: "Pick from available offers" },
  "howItWorks.step2.title": { ar: "أكمل المهام", en: "Complete the Tasks" },
  "howItWorks.step2.desc": {
    ar: "اتبع التعليمات وأكمل المطلوب",
    en: "Follow instructions and finish",
  },
  "howItWorks.step3.title": { ar: "احصل على النقاط", en: "Earn Points" },
  "howItWorks.step3.desc": {
    ar: "احصل على نقاط وادخل السحب",
    en: "Collect points and join the raffle",
  },


};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  return { t, language, changeLanguage };
};
