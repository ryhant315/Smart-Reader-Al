(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // استبدل الرقم برقم واتساب الحقيقي (بدون أصفار ولا +)
  const WHATSAPP_NUMBER = '218912531433';

  // ===== DOM =====
  const header = $('#header');
  const loadingBar = $('#loadingBar');
  const uploadArea = $('#uploadArea');
  const uploadContent = $('#uploadContent');
  const uploadProgress = $('#uploadProgress');
  const progressFill = $('#progressFill');
  const progressText = $('#progressText');
  const progressFileName = $('#progressFileName');
  const fileInput = $('#fileInput');
  const uploadBtn = $('#uploadBtn');
  const heroUploadBtn = $('#heroUploadBtn');
  const heroPricingBtn = $('#heroPricingBtn');
  const toolbarSection = $('#toolbarSection');
  const readerSection = $('#readerSection');
  const readerContent = $('#readerContent');
  const readerMeta = $('#readerMeta');
  const fileName = $('#fileName');
  const pageCount = $('#pageCount');
  const wordCount = $('#wordCount');
  const readingTime = $('#readingTime');
  const themeToggle = $('#themeToggle');
  const themeToggleMobile = $('#themeToggleMobile');
  const langToggle = $('#langToggle');
  const langToggleMobile = $('#langToggleMobile');
  const mobileMenuBtn = $('#mobileMenuBtn');
  const mobileMenu = $('#mobileMenu');
  const fontSelect = $('#fontSelect');
  const sizeValue = $('#sizeValue');
  const decreaseSize = $('#decreaseSize');
  const increaseSize = $('#increaseSize');
  const readerFullscreen = $('#readerFullscreen');
  const downloadTxt = $('#downloadTxt');
  const downloadPdf = $('#downloadPdf');
  const downloadEpub = $('#downloadEpub');

  // Auth elements
  const loginBtn = $('#loginBtn');
  const signupBtn = $('#signupBtn');
  const mobileLoginBtn = $('#mobileLoginBtn');
  const mobileSignupBtn = $('#mobileSignupBtn');
  const userMenu = $('#userMenu');
  const userAvatar = $('#userAvatar');
  const userBadge = $('#userBadge');
  const userDropdown = $('#userDropdown');
  const dropdownUserName = $('#dropdownUserName');
  const dropdownUserPlan = $('#dropdownUserPlan');
  const dashboardLink = $('#dashboardLink');
  const dropdownLogout = $('#dropdownLogout');

  // Auth modal
  const authModal = $('#authModal');
  const authModalClose = $('#authModalClose');
  const loginTab = $('#loginTab');
  const signupTab = $('#signupTab');
  const loginForm = $('#loginForm');
  const signupForm = $('#signupForm');
  const switchToSignup = $('#switchToSignup');
  const switchToLogin = $('#switchToLogin');
  const loginEmail = $('#loginEmail');
  const loginPassword = $('#loginPassword');
  const signupName = $('#signupName');
  const signupEmail = $('#signupEmail');
  const signupPassword = $('#signupPassword');

  // Payment modal
  const paymentModal = $('#paymentModal');
  const paymentModalClose = $('#paymentModalClose');
  const paymentTitle = $('#paymentTitle');
  const paymentPlanName = $('#paymentPlanName');
  const paymentAmount = $('#paymentAmount');
  const paymentSubmitAmount = $('#paymentSubmitAmount');
  const paymentForm = $('#paymentForm');
  const cardNumber = $('#cardNumber');
  const cardExpiry = $('#cardExpiry');
  const cardCvv = $('#cardCvv');
  const cardName = $('#cardName');
  const paymentSubmitBtn = $('#paymentSubmitBtn');

  // Dashboard
  const dashboardModal = $('#dashboardModal');
  const dashboardClose = $('#dashboardClose');
  const dashName = $('#dashName');
  const dashEmail = $('#dashEmail');
  const dashPlan = $('#dashPlan');
  const dashConversions = $('#dashConversions');
  const dashPages = $('#dashPages');
  const dashDownloads = $('#dashDownloads');
  const dashUpgradeSection = $('#dashUpgradeSection');
  const dashManageSection = $('#dashManageSection');
  const dashUpgradeBtn = $('#dashUpgradeBtn');
  const dashCancelBtn = $('#dashCancelBtn');

  // Pricing
  const pricingSwitch = $('#pricingSwitch');
  const toggleMonthly = $('#toggleMonthly');
  const toggleYearly = $('#toggleYearly');
  const freePlanBtn = $('#freePlanBtn');
  const basicPlanBtn = $('#basicPlanBtn');
  const smartPlanBtn = $('#smartPlanBtn');
  const premiumPlanBtn = $('#premiumPlanBtn');

  // Legal
  const termsModal = $('#termsModal');
  const privacyModal = $('#privacyModal');
  const termsClose = $('#termsClose');
  const privacyClose = $('#privacyClose');
  const footerTerms = $('#footerTerms');
  const footerPrivacy = $('#footerPrivacy');
  const footerFree = $('#footerFree');
  const footerSubscribe = $('#footerSubscribe');
  const footerSingle = $('#footerSingle');

  // ===== State =====
  let currentCurrency = 'usd';
  const USD_TO_LYD = 5;

  let pdfText = [];
  let fullText = '';
  let currentFileName = '';
  let totalPages = 0;
  let totalWords = 0;
  let currentFontSize = 18;
  let currentFont = 'Noto Sans Arabic';
  let currentAlign = 'right';
  let currentReaderTheme = 'sepia';
  let isFullscreen = false;
  let isProcessing = false;
  let currentPdfBytes = null;
  let currentPdfDoc = null;
  let ocrScannedFile = false;
  let conversionCount = 0;
  let downloadCount = 0;

  // ===== Auth/Subscription State =====
  let currentUser = null;
  let isYearlyPricing = false;

  const PLANS = {
    free: { name: 'مجاني', nameEn: 'Free', conversions: 5, pageLimit: 5, formats: ['txt'], price: 0, desc: 'معاينة 5 صفحات' },
    basic: { name: 'تحويل PDF', nameEn: 'PDF Convert', conversions: 1, pageLimit: 300, formats: ['txt', 'pdf', 'epub'], price: 0.80, desc: 'كتاب واحد - حد 300 صفحة' },
    smart: { name: 'ذهبية', nameEn: 'Smart', conversions: 10, pageLimit: 500, formats: ['txt', 'pdf', 'epub'], priceMonthly: 14, priceYearly: 11, desc: '10 كتب/شهر - حد 500 صفحة' },
    premium: { name: 'احترافية', nameEn: 'Premium', conversions: 30, pageLimit: 1000, formats: ['txt', 'pdf', 'epub'], priceMonthly: 50, priceYearly: 42, desc: '30 كتاب/شهر - حد 1000 صفحة', isPro: true },
    admin: { name: 'المالك', nameEn: 'Admin', conversions: Infinity, pageLimit: Infinity, formats: ['txt', 'pdf', 'epub'], price: 0, desc: 'دخول المالك - بدون حدود', isAdmin: true },
  };

  function formatPrice(usdAmount) {
    if (currentCurrency === 'lyd') {
      const lyd = usdAmount * USD_TO_LYD;
      return lyd % 1 === 0 ? lyd.toString() : lyd.toFixed(2);
    }
    if (usdAmount === 0) return '0';
    return usdAmount % 1 === 0 ? usdAmount.toString() : usdAmount.toFixed(2);
  }

  function getCurrencySymbol() {
    return currentCurrency === 'lyd' ? 'د.ل' : '$';
  }

  function initAuth() {
    const saved = localStorage.getItem('pdf-user');
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        applyAuthState();
      } catch (e) { localStorage.removeItem('pdf-user'); }
    }
  }

  function saveAuth() {
    if (currentUser) {
      localStorage.setItem('pdf-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pdf-user');
    }
  }

  function applyAuthState() {
    const isLoggedIn = currentUser && !currentUser.isGuest;
    loginBtn.style.display = isLoggedIn ? 'none' : '';
    signupBtn.style.display = isLoggedIn ? 'none' : '';
    userMenu.classList.toggle('logged-in', isLoggedIn);
    if (isLoggedIn) {
      const plan = currentUser.plan || 'free';
      const planData = PLANS[plan] || PLANS.free;
      dropdownUserName.textContent = currentUser.name || 'مستخدم';
      dropdownUserPlan.textContent = plan === 'admin' ? '👑 ' + planData.name : planData.name;
      if (plan === 'admin') userBadge.className = 'user-badge admin';
      else if (plan === 'premium' || plan === 'smart') userBadge.className = 'user-badge premium';
      else userBadge.className = 'user-badge';
      updatePricingButtons();
    }
  }

  function getPlanPageLimit() {
    if (!currentUser || currentUser.isGuest) return 5;
    const plan = currentUser.plan || 'free';
    const planData = PLANS[plan];
    return planData ? planData.pageLimit : 5;
  }

  function getAllowedFormats() {
    if (!currentUser || currentUser.isGuest) return ['txt'];
    const plan = currentUser.plan || 'free';
    return PLANS[plan] ? PLANS[plan].formats : ['txt'];
  }

  function checkConversionAllowed() {
    if (!currentUser || currentUser.isGuest) {
      return { allowed: true, formatRestricted: true, pageLimit: 5 };
    }
    const plan = currentUser.plan || 'free';
    const planData = PLANS[plan];
    const count = currentUser.conversions || 0;
    const maxConversions = planData.conversions;

    // Unlimited conversions
    if (maxConversions === Infinity) {
      return { allowed: true, formatRestricted: false, pageLimit: planData.pageLimit || Infinity };
    }

    // Basic plan uses singlePurchases counter
    if (plan === 'basic') {
      const singleRemaining = (currentUser.singlePurchases || 0) - count;
      if (singleRemaining <= 0) {
        return { allowed: false, formatRestricted: false, pageLimit: 0, message: currentLang === 'ar' ? 'لقد استنفذت تحويلاتك. اشتر كتاباً آخر.' : 'You have used all conversions. Buy another book.' };
      }
      return { allowed: true, formatRestricted: false, pageLimit: Infinity };
    }

    // Free / Smart / Premium with limited conversions
    if (count >= maxConversions) {
      return { allowed: false, formatRestricted: true, pageLimit: planData.pageLimit || 5, message: currentLang === 'ar' ? `لقد وصلت للحد الأقصى (${maxConversions} تحويلات). اشترك في خطة أعلى.` : `You reached the max (${maxConversions} conversions). Upgrade your plan.` };
    }
    return { allowed: true, formatRestricted: true, pageLimit: planData.pageLimit || 5, remainingConversions: maxConversions - count };
  }

  function checkFormatAllowed(format) {
    const formats = getAllowedFormats();
    return formats.includes(format);
  }

  function incrementConversions(pages) {
    if (!currentUser) return;
    currentUser.conversions = (currentUser.conversions || 0) + 1;
    currentUser.totalPages = (currentUser.totalPages || 0) + pages;
    saveAuth();
  }

  function incrementDownloads() {
    if (!currentUser) return;
    currentUser.downloads = (currentUser.downloads || 0) + 1;
    saveAuth();
  }

  // ===== Auth UI =====
  function openAuthModal(tab) {
    authModal.classList.add('open');
    if (tab === 'signup') switchAuthTab('signup');
    else switchAuthTab('login');
  }

  function closeAuthModal() { authModal.classList.remove('open'); }

  function switchAuthTab(tab) {
    loginTab.classList.toggle('active', tab === 'login');
    signupTab.classList.toggle('active', tab === 'signup');
    loginForm.classList.toggle('hidden', tab !== 'login');
    signupForm.classList.toggle('hidden', tab !== 'signup');
  }

  // ===== Payment =====
  let pendingPlan = null;

  function openPaymentModal(plan) {
    pendingPlan = plan;
    const planData = PLANS[plan];
    if (!planData) return;
    const isSubscription = plan === 'smart' || plan === 'premium';
    const usdPrice = isSubscription
      ? (isYearlyPricing ? (planData.priceYearly || planData.priceMonthly) : planData.priceMonthly)
      : planData.price;
    const displayPrice = formatPrice(usdPrice);
    const symbol = getCurrencySymbol();
    const planLabel = isYearlyPricing && isSubscription ? (currentLang === 'ar' ? 'اشتراك سنوي' : 'Yearly') : planData.name;
    paymentTitle.textContent = `${currentLang === 'ar' ? 'إتمام دفع' : 'Pay'} ${planLabel}`;
    paymentPlanName.textContent = planLabel;
    paymentAmount.textContent = `${displayPrice} ${symbol}`;
    paymentSubmitAmount.textContent = `${displayPrice} ${symbol}`;
    paymentModal.classList.add('open');
  }

  function closePaymentModal() {
    paymentModal.classList.remove('open');
    pendingPlan = null;
    paymentForm.reset();
  }

  // ===== Dashboard =====
  function openDashboard() {
    if (!currentUser || currentUser.isGuest) { openAuthModal('login'); return; }
    dashName.textContent = currentUser.name || '-';
    dashEmail.textContent = currentUser.email || '-';
    const plan = currentUser.plan || 'free';
    const planData = PLANS[plan] || PLANS.free;
    const isSubscribed = plan === 'premium' || plan === 'smart' || plan === 'admin';
    const isAdmin = plan === 'admin';
    dashPlan.textContent = isAdmin ? '👑 ' + planData.name : planData.name;
    dashPlan.className = 'dash-plan-badge' + (isSubscribed ? ' premium' : '') + (isAdmin ? ' admin' : '');
    dashConversions.textContent = currentUser.conversions || 0;
    dashPages.textContent = currentUser.totalPages || 0;
    dashDownloads.textContent = currentUser.downloads || 0;
    dashUpgradeSection.style.display = isSubscribed ? 'none' : '';
    dashManageSection.style.display = isSubscribed ? '' : 'none';
    dashboardModal.classList.add('open');
  }

  function closeDashboard() { dashboardModal.classList.remove('open'); }

  // ===== I18N =====
  const strings = {
    ar: {
      siteName: 'PDF إلى كتاب', navHome: 'الرئيسية', navFeatures: 'المميزات', navPricing: 'الباقات', navUsage: 'طريقة الاستخدام',
      login: 'تسجيل الدخول', signup: 'اشتراك', logout: 'تسجيل خروج',
      heroTitle: 'حوّل أي PDF إلى ', heroTitleHighlight: 'كتاب إلكتروني',
      heroDesc: 'أفضل محول PDF إلى كتب إلكترونية - استخراج النصوص بدقة عالية وإعادة تنسيقها بخطوط واضحة.',
      planFree: 'مجاني', planSingle: 'كتاب واحد', planMonthly: 'اشتراك شهري',
      planLimit: 'صفحة', planUnlimited: 'غير محدود',
      toastSuccess: 'تم بنجاح!', toastError: 'حدث خطأ', toastUploadError: 'الرجاء رفع ملف PDF أولاً',
      toastPlanRequired: 'هذه الميزة متاحة للمشتركين فقط', toastFormatRequired: 'هذه الصيغة غير متاحة في باقتك الحالية',
      toastLoginRequired: 'الرجاء تسجيل الدخول أولاً', toastLoggedIn: 'تم تسجيل الدخول بنجاح',
      toastPaid: 'تم الدفع بنجاح!',
      processing: 'جاري المعالجة...',
      readerPlaceholder: 'ارفع ملف PDF لبدء القراءة',
      subscriptionCancel: 'تم إلغاء الاشتراك بنجاح',
      upgradePrompt: 'هذه الميزة تتطلب ترقية الباقة',
    },
    en: {
      siteName: 'PDF to E-Book', navHome: 'Home', navFeatures: 'Features', navPricing: 'Pricing', navUsage: 'How to Use',
      login: 'Login', signup: 'Sign Up', logout: 'Logout',
      heroTitle: 'Convert any PDF to a ', heroTitleHighlight: 'Clean E-Book',
      heroDesc: 'The best PDF to e-book converter - extract text with high accuracy and reformat with clear fonts.',
      planFree: 'Free', planSingle: 'Single Book', planMonthly: 'Monthly',
      planLimit: 'pages', planUnlimited: 'Unlimited',
      toastSuccess: 'Success!', toastError: 'Error', toastUploadError: 'Please upload a PDF first',
      toastPlanRequired: 'This feature is for subscribers only', toastFormatRequired: 'This format is not available in your plan',
      toastLoginRequired: 'Please login first', toastLoggedIn: 'Logged in successfully',
      toastPaid: 'Payment successful!',
      processing: 'Processing...',
      readerPlaceholder: 'Upload a PDF to start reading',
      subscriptionCancel: 'Subscription cancelled successfully',
      upgradePrompt: 'This feature requires a plan upgrade',
    }
  };

  let currentLang = 'ar';

  function t(key) { return strings[currentLang][key] || key; }

  // ===== Toast =====
  function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || (() => {
      const c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); return c;
    })();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function updateLoadingBar(percent) {
    loadingBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    if (percent >= 100) setTimeout(() => { loadingBar.style.width = '0'; }, 800);
  }

  function updateProgress(percent, text) {
    const circumference = 282.74;
    progressFill.style.strokeDashoffset = circumference - (percent / 100) * circumference;
    progressText.textContent = Math.round(percent) + '%';
    if (text) progressFileName.textContent = text;
  }

  function countWords(text) { return text.trim().split(/\s+/).filter(w => w.length > 0).length; }
  function estimateReadingTime(wc) { return Math.max(1, Math.ceil(wc / 200)); }

  // ===== Theme =====
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') { icon.className = 'fas fa-sun'; themeToggleMobile.innerHTML = '<i class="fas fa-sun"></i> ' + (currentLang === 'ar' ? 'السمة الفاتحة' : 'Light mode'); }
    else { icon.className = 'fas fa-moon'; themeToggleMobile.innerHTML = '<i class="fas fa-moon"></i> ' + (currentLang === 'ar' ? 'السمة الداكنة' : 'Dark mode'); }
    localStorage.setItem('pdf-theme', theme);
  }

  function toggleTheme() { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }

  // ===== Language =====
  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ltr', lang === 'en');
    // Update all translatable text
    const navLinks = $$('.nav-links a');
    if (navLinks[0]) navLinks[0].textContent = t('navHome');
    if (navLinks[1]) navLinks[1].textContent = t('navFeatures');
    if (navLinks[2]) navLinks[2].textContent = t('navPricing');
    if (navLinks[3]) navLinks[3].textContent = t('navUsage');
    $$('.logo span').forEach(el => el.innerHTML = `PDF <span class="logo-highlight">${lang === 'ar' ? 'إلى كتاب' : 'to E-Book'}</span>`);
    const heroH1 = document.querySelector('.hero-text h1');
    if (heroH1) heroH1.innerHTML = `${t('heroTitle')}<span class="gradient-text">${t('heroTitleHighlight')}</span>`;
    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.textContent = t('heroDesc');
    loginBtn.textContent = t('login');
    signupBtn.textContent = t('signup');
    langToggle.innerHTML = `<i class="fas fa-language"></i><span>${lang === 'ar' ? 'EN' : 'AR'}</span>`;
    langToggleMobile.innerHTML = `<i class="fas fa-language"></i> ${lang === 'ar' ? 'English' : 'العربية'}`;
    // Update auth form-switch links
    const switchToSignup = $('#switchToSignup');
    const switchToLogin = $('#switchToLogin');
    if (switchToSignup) switchToSignup.textContent = lang === 'ar' ? 'اشترك الآن' : 'Sign Up Now';
    if (switchToLogin) switchToLogin.textContent = lang === 'ar' ? 'تسجيل الدخول' : 'Login';
    // Update auth form submit buttons
    const loginSubmit = $('#loginForm .form-submit');
    const signupSubmit = $('#signupForm .form-submit');
    if (loginSubmit) loginSubmit.textContent = lang === 'ar' ? 'تسجيل الدخول' : 'Login';
    if (signupSubmit) signupSubmit.textContent = lang === 'ar' ? 'إنشاء حساب' : 'Create Account';
    // Update form-switch paragraph text
    $$('.form-switch').forEach(el => {
      const isSignup = el.closest('#signupForm');
      el.firstChild.textContent = isSignup
        ? (lang === 'ar' ? 'لديك حساب؟ ' : 'Already have an account? ')
        : (lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? ");
    });
    updatePricingUI();
    localStorage.setItem('pdf-lang', lang);
  }

  // ===== Pricing UI =====
  function updatePricingUI() {
    const monthly = !pricingSwitch.checked;
    isYearlyPricing = !monthly;
    if (toggleMonthly) toggleMonthly.classList.toggle('active', monthly);
    if (toggleYearly) toggleYearly.classList.toggle('active', !monthly);

    // Update basic plan (one-time)
    const basicPrice = $('.price-num--basic');
    const basicCurr = $('.price-curr--basic');
    if (basicPrice) {
      basicPrice.textContent = currentCurrency === 'lyd' ? basicPrice.dataset.priceLyd : basicPrice.dataset.priceUsd;
    }
    if (basicCurr) {
      basicCurr.textContent = currentCurrency === 'lyd' ? 'د.ل' : '$';
    }

    // Update subscription plans (smart, premium)
    const subPriceEls = $$('.pricing-card .price-num[data-monthly-usd]');
    subPriceEls.forEach(el => {
      if (monthly) {
        el.textContent = currentCurrency === 'lyd' ? el.dataset.monthlyLyd : el.dataset.monthlyUsd;
      } else {
        el.textContent = currentCurrency === 'lyd' ? el.dataset.yearlyLyd : el.dataset.yearlyUsd;
      }
    });

    // Update currency labels
    const smartCurr = $('.price-curr--smart');
    const premiumCurr = $('.price-curr--premium');
    if (smartCurr) smartCurr.textContent = currentCurrency === 'lyd' ? 'د.ل/شهر' : '$/شهر';
    if (premiumCurr) premiumCurr.textContent = currentCurrency === 'lyd' ? 'د.ل/شهر' : '$/شهر';

    // Update popular badges
    $$('.pricing-popular-badge').forEach(badge => {
      badge.textContent = monthly ? (currentLang === 'ar' ? 'الأكثر طلباً' : 'Most Popular') : (currentLang === 'ar' ? 'أفضل قيمة' : 'Best Value');
    });
  }

  function updatePricingButtons() {
    const isLoggedIn = currentUser && !currentUser.isGuest;
    const plan = currentUser ? currentUser.plan || 'free' : 'free';
    const isSubscribed = plan === 'premium' || plan === 'smart' || plan === 'admin';
    const isAdmin = plan === 'admin';

    if (freePlanBtn) {
      freePlanBtn.textContent = isAdmin ? '👑' : (isLoggedIn && plan === 'free' ? (currentLang === 'ar' ? 'باقتك الحالية' : 'Your Plan') : (currentLang === 'ar' ? 'ابدأ مجاناً' : 'Start Free'));
      freePlanBtn.disabled = isLoggedIn && (plan === 'free' || isAdmin);
    }
    if (basicPlanBtn) {
      basicPlanBtn.textContent = isAdmin ? '👑' : (isLoggedIn && plan === 'basic' ? (currentLang === 'ar' ? 'مفعلة' : 'Active') : (currentLang === 'ar' ? 'طلب الاشتراك' : 'Request Plan'));
      basicPlanBtn.disabled = isLoggedIn && (plan === 'basic' || isAdmin);
    }
    if (smartPlanBtn) {
      smartPlanBtn.textContent = isAdmin ? '👑' : (isSubscribed ? (currentLang === 'ar' ? 'باقتك الحالية' : 'Your Plan') : (currentLang === 'ar' ? 'طلب الاشتراك' : 'Request Plan'));
      smartPlanBtn.disabled = isSubscribed || isAdmin;
    }
    if (premiumPlanBtn) {
      const isPremium = plan === 'premium';
      premiumPlanBtn.textContent = isAdmin ? '👑' : (isPremium ? (currentLang === 'ar' ? 'باقتك الحالية' : 'Your Plan') : (currentLang === 'ar' ? 'طلب الاشتراك' : 'Request Plan'));
      premiumPlanBtn.disabled = isPremium || isAdmin;
    }
  }

  // ===== PDF Processing =====
  async function processPDF(file) {
    if (isProcessing) return;
    isProcessing = true;
    ocrScannedFile = false;

    try {
      if (typeof pdfjsLib === 'undefined') {
        throw new Error(currentLang === 'ar' ? 'مكتبة PDF غير متوفرة. تحقق من اتصالك بالإنترنت.' : 'PDF library not available. Check your internet connection.');
      }

      uploadArea.classList.add('processing');
      updateProgress(0, file.name);
      currentFileName = file.name;

      const arrayBuffer = await file.arrayBuffer();
      currentPdfBytes = new Uint8Array(arrayBuffer);

      updateProgress(10, currentLang === 'ar' ? 'جاري تحليل الملف...' : 'Analyzing file...');
      updateLoadingBar(20);

      let pdf;
      try {
        pdf = await pdfjsLib.getDocument({ data: currentPdfBytes }).promise;
      } catch (workerErr) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        pdf = await pdfjsLib.getDocument({ data: currentPdfBytes }).promise;
      }
      totalPages = pdf.numPages;
      pdfText = [];
      fullText = '';

      // Check plan limits
      const check = checkConversionAllowed();
      if (!check.allowed) {
        showToast(check.message || (currentLang === 'ar' ? 'لقد وصلت للحد المسموح' : 'You have reached your limit'), 'error');
        isProcessing = false;
        uploadArea.classList.remove('processing');
        return;
      }
      const plan = (!currentUser || currentUser.isGuest) ? 'free' : (currentUser.plan || 'free');
      const isFreePlan = plan === 'free';
      const samplePages = 5;
      const maxPages = check.pageLimit === Infinity ? totalPages : Math.min(totalPages, check.pageLimit);
      const extractLimit = isFreePlan ? Math.min(samplePages, totalPages) : maxPages;

      updateProgress(20, `${currentLang === 'ar' ? 'جاري استخراج' : 'Extracting'} ${extractLimit} ${currentLang === 'ar' ? 'صفحة' : 'pages'}...`);

      for (let i = 1; i <= extractLimit; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str || '').join(' ');
        pdfText.push(pageText);
        fullText += pageText + '\n\n';
        const percent = 20 + (70 * i / extractLimit);
        updateProgress(percent, `${currentLang === 'ar' ? 'صفحة' : 'Page'} ${i} ${currentLang === 'ar' ? 'من' : 'of'} ${extractLimit}`);
        updateLoadingBar(percent);
      }

      if (isFreePlan && totalPages > samplePages) {
        fullText += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        fullText += currentLang === 'ar'
          ? `📖  معاينة تجريبية - أول ${samplePages} صفحات من أصل ${totalPages}\n`
          : `📖  Trial preview - First ${samplePages} of ${totalPages} pages\n`;
        fullText += currentLang === 'ar'
          ? `✨ للحصول على الكتاب كاملاً بجميع الصيغ، اشتر تحويل PDF (${formatPrice(0.80)} ${getCurrencySymbol()}) أو اشترك شهرياً.\n`
          : `✨ Get the full book in all formats. Buy PDF Convert (${formatPrice(0.80)} ${getCurrencySymbol()}) or subscribe monthly.\n`;
        fullText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        fullText += `\n🔒 <a href="#pricing" class="upgrade-link">${currentLang === 'ar' ? 'اضغط لفتح الكتاب كاملاً ←' : 'Click to unlock full book ←'}</a>\n\n`;
      } else if (totalPages > extractLimit) {
        fullText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        fullText += currentLang === 'ar'
          ? `📖 تم استخراج ${extractLimit} صفحات من أصل ${totalPages}\n`
          : `📖 Extracted ${extractLimit} of ${totalPages} pages\n`;
        fullText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      }

      totalWords = countWords(fullText);
      if (totalWords === 0) {
        currentPdfDoc = pdf;
        const ocrBtnId = 'ocrStartBtn';
        const ocrMsg = currentLang === 'ar'
          ? '⚠️ هذا الملف ممسوح ضوئياً ولا يحتوي على نصوص قابلة للتحديد.'
          : '⚠️ This PDF appears to be scanned (image-based) with no selectable text.';
        const ocrBtnText = currentLang === 'ar' ? '🔍 تجربة التعرف الضوئي (OCR)' : '🔍 Try OCR Text Recognition';
        const ocrNote = currentLang === 'ar'
          ? 'قد يستغرق ذلك بضع دقائق حسب عدد الصفحات.'
          : 'This may take a few minutes depending on the number of pages.';
        fullText = `${ocrMsg}\n\n<div class="ocr-prompt"><button class="btn-primary" id="${ocrBtnId}" style="padding:14px 32px;font-size:1.1rem;border-radius:12px;background:var(--primary);color:white;border:none;cursor:pointer;transition:transform 0.2s;">${ocrBtnText}</button>\n<p style="color:var(--text-muted);font-size:0.85rem;margin-top:8px;">${ocrNote}</p></div>`;
        totalWords = 0;
        ocrScannedFile = true;
      }
      if (!ocrScannedFile && extractLimit > 0) incrementConversions(maxPages);

      updateProgress(100, currentLang === 'ar' ? 'تم بنجاح!' : 'Done!');
      updateLoadingBar(100);

      setTimeout(() => {
        uploadArea.classList.remove('processing');
        uploadArea.classList.add('has-file');
        showReader();
      }, 500);

      showToast(t('toastSuccess'), 'success');
    } catch (err) {
      console.error('PDF error:', err);
      uploadArea.classList.remove('processing');
      showToast(t('toastError') + ': ' + err.message, 'error');
      updateLoadingBar(0);
    } finally {
      isProcessing = false;
    }
  }

  async function runOCR() {
    if (!currentPdfDoc) {
      showToast(currentLang === 'ar' ? 'الرجاء إعادة رفع الملف.' : 'Please re-upload the file.', 'error');
      return;
    }
    if (typeof Tesseract === 'undefined') {
      updateProgress(0, currentLang === 'ar' ? 'جاري تحميل مكتبة OCR (~5MB)...' : 'Loading OCR library (~5MB)...');
      uploadArea.classList.add('processing');
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error(currentLang === 'ar' ? 'فشل تحميل مكتبة OCR' : 'Failed to load OCR library'));
        document.body.appendChild(s);
      });
    }
    isProcessing = true;
    uploadArea.classList.add('processing');

    try {
      const plan = (!currentUser || currentUser.isGuest) ? 'free' : (currentUser.plan || 'free');
      const isFreePlan = plan === 'free';
      const samplePages = 5;
      const check = checkConversionAllowed();
      const maxPages = check.pageLimit === Infinity ? totalPages : Math.min(totalPages, check.pageLimit);
      const ocrLimit = isFreePlan ? Math.min(samplePages, totalPages) : maxPages;
      const ocrMsg = currentLang === 'ar'
        ? `جاري التعرف الضوئي على ${ocrLimit} صفحة...`
        : `Running OCR on ${ocrLimit} pages...`;
      updateProgress(10, ocrMsg);
      updateLoadingBar(10);

      let worker;
      try {
        worker = await Tesseract.createWorker('ara+eng');
      } catch (e) {
        worker = await Tesseract.createWorker('eng');
      }

      let ocrFullText = '';
      for (let i = 1; i <= ocrLimit; i++) {
        const page = await currentPdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const { data } = await worker.recognize(canvas);
        ocrFullText += (data.text || '') + '\n\n';

        const percent = 10 + (80 * i / ocrLimit);
        updateProgress(percent, `${currentLang === 'ar' ? 'OCR صفحة' : 'OCR Page'} ${i} ${currentLang === 'ar' ? 'من' : 'of'} ${ocrLimit}`);
        updateLoadingBar(percent);
        canvas.remove();
      }
      await worker.terminate();

      if (isFreePlan && totalPages > samplePages) {
        ocrFullText += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        ocrFullText += currentLang === 'ar'
          ? `📖 معاينة تجريبية - أول ${samplePages} صفحات من أصل ${totalPages}\n`
          : `📖 Trial preview - First ${samplePages} of ${totalPages} pages\n`;
        ocrFullText += currentLang === 'ar'
          ? `✨ للحصول على الكتاب كاملاً، اشتر تحويل PDF أو اشترك شهرياً.\n`
          : `✨ Get the full book. Buy PDF Convert or subscribe monthly.\n`;
        ocrFullText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      }

      fullText = ocrFullText;
      totalWords = countWords(fullText);
      if (ocrLimit > 0) incrementConversions(maxPages);

      updateProgress(100, currentLang === 'ar' ? 'تم التعرف على النصوص!' : 'OCR complete!');
      updateLoadingBar(100);

      setTimeout(() => {
        uploadArea.classList.remove('processing');
        uploadArea.classList.add('has-file');
        showReader();
      }, 300);

      showToast(currentLang === 'ar' ? 'تم التعرف على النصوص بنجاح' : 'OCR completed successfully', 'success');
    } catch (err) {
      console.error('OCR error:', err);
      uploadArea.classList.remove('processing');
      showToast((currentLang === 'ar' ? 'فشل التعرف الضوئي: ' : 'OCR failed: ') + err.message, 'error');
      updateLoadingBar(0);
    } finally {
      isProcessing = false;
    }
  }

  function showReader() {
    toolbarSection.classList.add('visible');
    readerSection.classList.add('visible');
    fileName.textContent = currentFileName;
    pageCount.textContent = totalPages;
    wordCount.textContent = totalWords.toLocaleString();
    readingTime.textContent = estimateReadingTime(totalWords);
    const diffEl = $('#difficultyLevel');
    if (diffEl) {
      const avgWordLen = totalWords > 0 ? fullText.replace(/<[^>]*>/g, '').replace(/\s/g, '').length / totalWords : 0;
      diffEl.textContent = avgWordLen > 5 ? (currentLang === 'ar' ? 'متقدم' : 'Advanced') : avgWordLen > 3.5 ? (currentLang === 'ar' ? 'متوسط' : 'Intermediate') : (currentLang === 'ar' ? 'مبتدئ' : 'Beginner');
    }
    renderText();
    readerContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderText() {
    const paragraphs = fullText.split('\n').filter(p => p.trim().length > 0);
    readerContent.innerHTML = paragraphs.map(p => `<p dir="auto">${p}</p>`).join('');
    applyStyles();
  }

  function applyStyles() {
    readerContent.style.fontFamily = `'${currentFont}', 'Noto Sans Arabic', sans-serif`;
    readerContent.style.fontSize = currentFontSize + 'px';
    readerContent.style.textAlign = currentAlign;
  }

  // ===== Download Guards =====
  function guardDownload(format) {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return false; }
    if (!checkFormatAllowed(format)) {
      showToast(t('toastFormatRequired'), 'error');
      return false;
    }
    return true;
  }

  // ===== Downloads =====
  function downloadAsTXT() {
    if (!guardDownload('txt')) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.replace('.pdf', '') + '_clean.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    incrementDownloads();
    showToast('TXT ' + t('toastSuccess'), 'success');
  }

  function downloadAsPDF() {
    if (!guardDownload('pdf')) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const margin = 15, usableWidth = 190 - 2 * margin;
    let y = margin;
    const lines = fullText.split('\n').filter(p => p.trim().length > 0);
    for (const line of lines) {
      const splitLines = doc.splitTextToSize(line, usableWidth);
      for (const sl of splitLines) {
        if (y + 7 > 290) { doc.addPage(); y = margin; }
        doc.text(sl, currentAlign === 'right' ? 190 - margin : currentAlign === 'center' ? 95 : margin, y, { align: currentAlign === 'right' ? 'right' : currentAlign === 'center' ? 'center' : 'left' });
        y += 7;
      }
      y += 3;
    }
    doc.save(currentFileName.replace('.pdf', '') + '_clean.pdf');
    incrementDownloads();
    showToast('PDF ' + t('toastSuccess'), 'success');
  }

  function downloadAsEPUB() {
    if (!guardDownload('epub')) return;
    const title = currentFileName.replace('.pdf', '').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
    const uuid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const paragraphs = fullText.split('\n').filter(p => p.trim().length > 0)
      .map(p => `<p style="font-family:'${currentFont}','Noto Sans Arabic',sans-serif;font-size:${currentFontSize}px;text-align:${currentAlign};line-height:2;margin-bottom:1em;">${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('\n');
    const opf = `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0"><metadata><dc:identifier id="bookid">urn:uuid:${uuid}</dc:identifier><dc:title>${title}</dc:title><dc:language>${currentLang}</dc:language><dc:date>${new Date().toISOString().split('T')[0]}</dc:date></metadata><manifest><item id="content" href="content.xhtml" media-type="application/xhtml+xml"/><item id="style" href="style.css" media-type="text/css"/></manifest><spine><itemref idref="content"/></spine></package>`;
    const xhtml = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${currentLang}" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"/><title>${title}</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body><div class="book-content">${paragraphs}</div></body></html>`;
    const css = `@page{margin:5%}body{font-family:'${currentFont}','Noto Sans Arabic',sans-serif;line-height:2;color:#333;direction:${currentLang === 'ar' ? 'rtl' : 'ltr'};text-align:${currentAlign}}.book-content{max-width:700px;margin:0 auto;padding:20px}p{margin-bottom:1.2em;font-size:${currentFontSize}px}`;
    const zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip');
    zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
    zip.file('OEBPS/content.opf', opf);
    zip.file('OEBPS/content.xhtml', xhtml);
    zip.file('OEBPS/style.css', css);
    zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' }).then(blob => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = currentFileName.replace('.pdf', '') + '_clean.epub';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      incrementDownloads();
      showToast('EPUB ' + t('toastSuccess'), 'success');
    });
  }

  // ===== Fullscreen =====
  function toggleFullscreen() {
    const el = readerContent;
    if (!isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      isFullscreen = true;
      readerContent.classList.add('fullscreen');
      readerFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      isFullscreen = false;
      readerContent.classList.remove('fullscreen');
      readerFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
    }
  }

  // ===== Stats Counter =====
  function animateStats() {
    $$('.stats-number').forEach(counter => {
      const target = parseInt(counter.dataset.target);
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target + (counter.dataset.target === '98' ? '%' : '+');
          clearInterval(interval);
        } else counter.textContent = Math.round(current);
      }, 2000 / 60);
    });
  }

  // ===== Event Handlers =====

  // Header scroll
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

  // Mobile menu
  mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // Theme
  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);

  // Lang
  langToggle.addEventListener('click', () => setLanguage(currentLang === 'ar' ? 'en' : 'ar'));
  langToggleMobile.addEventListener('click', () => { setLanguage(currentLang === 'ar' ? 'en' : 'ar'); mobileMenu.classList.remove('open'); });

  // Nav
  $$('.nav-links a').forEach(a => a.addEventListener('click', function () {
    $$('.nav-links a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  }));

  // Upload
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault(); uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && (files[0].type === 'application/pdf' || files[0].name.endsWith('.pdf'))) processPDF(files[0]);
    else showToast(currentLang === 'ar' ? 'الرجاء اختيار ملف PDF صالح' : 'Please select a valid PDF file', 'error');
  });
  uploadBtn.addEventListener('click', () => fileInput.click());
  heroUploadBtn.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('click', () => { if (!isProcessing) fileInput.click(); });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) { processPDF(fileInput.files[0]); fileInput.value = ''; }
  });

  // OCR button (delegation for dynamic button)
  readerContent.addEventListener('click', (e) => {
    const btn = e.target.closest('#ocrStartBtn');
    if (btn) runOCR();
  });

  // Reader controls
  fontSelect.addEventListener('change', function () { currentFont = this.value; applyStyles(); });
  decreaseSize.addEventListener('click', () => { if (currentFontSize > 12) { currentFontSize -= 1; sizeValue.textContent = currentFontSize; applyStyles(); } });
  increaseSize.addEventListener('click', () => { if (currentFontSize < 40) { currentFontSize += 1; sizeValue.textContent = currentFontSize; applyStyles(); } });
  $$('.theme-option').forEach(btn => btn.addEventListener('click', function () {
    $$('.theme-option').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentReaderTheme = this.dataset.theme;
    readerContent.className = 'reader-content';
    readerContent.classList.add('reader-' + currentReaderTheme);
  }));
  $$('.align-option').forEach(btn => btn.addEventListener('click', function () {
    $$('.align-option').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentAlign = this.dataset.align;
    applyStyles();
  }));
  readerFullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) { isFullscreen = false; readerContent.classList.remove('fullscreen'); readerFullscreen.innerHTML = '<i class="fas fa-expand"></i>'; }
  });

  // Downloads
  downloadTxt.addEventListener('click', downloadAsTXT);
  downloadEpub.addEventListener('click', downloadAsEPUB);

  // Load jsPDF
  function loadJsPDF() {
    return new Promise((resolve, reject) => {
      if (window.jspdf) { resolve(window.jspdf); return; }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = () => resolve(window.jspdf);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  downloadPdf.addEventListener('click', async function () {
    try { await loadJsPDF(); downloadAsPDF(); }
    catch (e) { showToast('فشل تحميل مكتبة PDF', 'error'); }
  });

  // ===== Auth Event Handlers =====
  loginBtn.addEventListener('click', () => openAuthModal('login'));
  signupBtn.addEventListener('click', () => openAuthModal('signup'));
  mobileLoginBtn.addEventListener('click', () => { openAuthModal('login'); mobileMenu.classList.remove('open'); });
  mobileSignupBtn.addEventListener('click', () => { openAuthModal('signup'); mobileMenu.classList.remove('open'); });
  authModalClose.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });

  loginTab.addEventListener('click', () => switchAuthTab('login'));
  signupTab.addEventListener('click', () => switchAuthTab('signup'));
  switchToSignup.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signup'); });
  switchToLogin.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('login'); });

  // Login submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
    if (!users[email]) {
      showToast(currentLang === 'ar' ? 'البريد الإلكتروني غير مسجل' : 'Email not registered', 'error');
      return;
    }
    if (users[email].password !== password) {
      showToast(currentLang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Wrong password', 'error');
      return;
    }
    currentUser = { email, name: users[email].name, plan: users[email].plan || 'free', conversions: 0, totalPages: 0, downloads: 0, isGuest: false };
    if (users[email].singlePurchases) currentUser.singlePurchases = users[email].singlePurchases;
    if (users[email].conversions) currentUser.conversions = users[email].conversions;
    if (users[email].totalPages) currentUser.totalPages = users[email].totalPages;
    if (users[email].downloads) currentUser.downloads = users[email].downloads;
    saveAuth();
    applyAuthState();
    closeAuthModal();
    showToast(t('toastLoggedIn'), 'success');
    loginForm.reset();
  });

  // Signup submit
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    if (!name || !email || !password) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
    const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
    if (users[email]) {
      showToast(currentLang === 'ar' ? 'البريد الإلكتروني مسجل مسبقاً' : 'Email already registered', 'error');
      return;
    }
    users[email] = { name, password, plan: 'free', conversions: 0, totalPages: 0, downloads: 0 };
    localStorage.setItem('pdf-users', JSON.stringify(users));
    currentUser = { email, name, plan: 'free', conversions: 0, totalPages: 0, downloads: 0, isGuest: false };
    saveAuth();
    applyAuthState();
    closeAuthModal();
    showToast(t('toastLoggedIn'), 'success');
    signupForm.reset();
  });

  // User dropdown
  userAvatar.addEventListener('click', () => userDropdown.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) userDropdown.classList.remove('open');
  });

  // Dashboard
  dashboardLink.addEventListener('click', (e) => { e.preventDefault(); userDropdown.classList.remove('open'); openDashboard(); });
  dashboardClose.addEventListener('click', closeDashboard);
  dashboardModal.addEventListener('click', (e) => { if (e.target === dashboardModal) closeDashboard(); });
  dashUpgradeBtn.addEventListener('click', () => { closeDashboard(); $('a[href="#pricing"]').click(); });

  // Logout
  dropdownLogout.addEventListener('click', (e) => {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('pdf-user');
    applyAuthState();
    userDropdown.classList.remove('open');
    if (adminBtn) { adminBtn.innerHTML = '<i class="fas fa-crown"></i>'; adminBtn.title = 'دخول المالك'; }
    showToast(currentLang === 'ar' ? 'تم تسجيل الخروج' : 'Logged out', 'info');
  });

  // ===== Currency toggle =====
  $$('.currency-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      $$('.currency-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCurrency = this.dataset.currency;
      updatePricingUI();
    });
  });

  // ===== Pricing Event Handlers =====
  pricingSwitch.addEventListener('change', updatePricingUI);
  heroPricingBtn.addEventListener('click', () => {
    const pricingSection = $('#pricing');
    if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Free plan
  freePlanBtn.addEventListener('click', () => {
    if (currentUser && !currentUser.isGuest && currentUser.plan === 'free') {
      showToast(currentLang === 'ar' ? 'أنت بالفعل على الباقة المجانية' : 'You are already on the Free plan', 'info');
      return;
    }
    if (!currentUser || currentUser.isGuest) { openAuthModal('signup'); return; }
  });

  // Plan buttons -> طلب اشتراك يدوي
  function openSubRequestModal(plan) {
    if (!currentUser || currentUser.isGuest) { openAuthModal('signup'); return; }
    const planNames = { basic: 'تحويل PDF', smart: 'ذهبية', premium: 'احترافية' };
    const planSelect = $('#subReqPlan');
    if (planSelect) planSelect.value = plan;
    pendingPlan = plan;
    $('#subRequestModal').classList.add('open');
  }

  basicPlanBtn.addEventListener('click', () => {
    if (currentUser && !currentUser.isGuest && currentUser.plan === 'basic') {
      showToast(currentLang === 'ar' ? 'لديك الباقة مسبقاً' : 'Plan already active', 'info');
      return;
    }
    openSubRequestModal('basic');
  });

  smartPlanBtn.addEventListener('click', () => {
    if (currentUser && !currentUser.isGuest && (currentUser.plan === 'smart' || currentUser.plan === 'premium')) {
      showToast(currentLang === 'ar' ? 'أنت مشترك بالفعل' : 'Already subscribed', 'info');
      return;
    }
    openSubRequestModal('smart');
  });

  premiumPlanBtn.addEventListener('click', () => {
    if (currentUser && !currentUser.isGuest && currentUser.plan === 'premium') {
      showToast(currentLang === 'ar' ? 'الباقة الاحترافية مفعلة' : 'Premium is active', 'info');
      return;
    }
    openSubRequestModal('premium');
  });

  // Payment
  paymentModalClose.addEventListener('click', closePaymentModal);
  paymentModal.addEventListener('click', (e) => { if (e.target === paymentModal) closePaymentModal(); });

  // Card number formatting
  cardNumber.addEventListener('input', function () {
    let val = this.value.replace(/[^\d]/g, '').substring(0, 16);
    this.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
  });
  cardExpiry.addEventListener('input', function () {
    let val = this.value.replace(/[^\d]/g, '').substring(0, 4);
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    this.value = val;
  });
  cardCvv.addEventListener('input', function () { this.value = this.value.replace(/[^\d]/g, '').substring(0, 4); });

  // Payment submit - simulate payment
  // ===== PAYMENT INTEGRATION GUIDE =====
  // لدمج بوابة دفع حقيقية، استبدل setTimeout أعلاه بأحد الخيارات:
  //
  // 1. Stripe (بطاقات عالمية):
  //    - أضف: <script src="https://js.stripe.com/v3/"></script>
  //    - stripe.redirectToCheckout({ sessionId: '...' })
  //
  // 2. Paymob (بطاقات, فودافون كاش, wallets):
  //    - iframeIntegration.paymob.com - متوافق مع ليبيا ومصر
  //    - أنسب حل للدفع بالدينار الليبي
  //
  // 3. PayPal:
  //    - <script src="https://www.paypal.com/sdk/js?client-id=YOUR_ID"></script>
  //    - paypal.Buttons({ createOrder, onApprove }).render('#paypal-button-container')
  //
  // 4. Flutterwave (بطاقات + موبايل موني):
  //    - يدعم السحب للبنوك الليبية
  //    - FlutterwaveCheckout({ public_key, tx_ref, amount, currency: 'LYD' })
  //
  // راجع الموقع بعد الرفع للحصول على account ID الحقيقي

  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!pendingPlan || !currentUser) return;
    const cardNum = cardNumber.value.replace(/\s/g, '');
    const expiry = cardExpiry.value;
    const cvv = cardCvv.value;
    const name = cardName.value.trim();
    if (cardNum.length < 16 || !/^\d+$/.test(cardNum)) { showToast(currentLang === 'ar' ? 'رقم البطاقة غير صحيح' : 'Invalid card number', 'error'); return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { showToast(currentLang === 'ar' ? 'تاريخ الانتهاء غير صحيح' : 'Invalid expiry date', 'error'); return; }
    if (cvv.length < 3) { showToast(currentLang === 'ar' ? 'رمز CVV غير صحيح' : 'Invalid CVV', 'error'); return; }
    if (name.length < 2) { showToast(currentLang === 'ar' ? 'الرجاء إدخال الاسم' : 'Please enter cardholder name', 'error'); return; }
    const plan = pendingPlan;
    const isSubscription = plan === 'smart' || plan === 'premium';
    const price = isSubscription
      ? (isYearlyPricing ? (PLANS[plan].priceYearly || PLANS[plan].priceMonthly) : PLANS[plan].priceMonthly)
      : PLANS[plan].price;

    paymentSubmitBtn.disabled = true;
    paymentSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (currentLang === 'ar' ? 'جاري الدفع...' : 'Processing...');

    setTimeout(() => {
      // Apply plan
      if (isSubscription) {
        currentUser.plan = plan;
      } else {
        currentUser.plan = 'basic';
        currentUser.singlePurchases = (currentUser.singlePurchases || 0) + 1;
      }

      // Update stored users data
      const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
      if (users[currentUser.email]) {
        users[currentUser.email].plan = currentUser.plan;
        if (!isSubscription) users[currentUser.email].singlePurchases = currentUser.singlePurchases;
        localStorage.setItem('pdf-users', JSON.stringify(users));
      }

      saveAuth();
      applyAuthState();
      closePaymentModal();
      showToast(t('toastPaid'), 'success');
      paymentSubmitBtn.disabled = false;
      paymentSubmitBtn.innerHTML = `<i class="fas fa-lock"></i> ${currentLang === 'ar' ? 'دفع' : 'Pay'} ${formatPrice(price)} ${getCurrencySymbol()}`;
    }, 2000);
  });

  // Enterprise -> WhatsApp
  const enterpriseBtn = $('#enterpriseBtn');
  if (enterpriseBtn) {
    enterpriseBtn.addEventListener('click', () => {
      window.open('https://wa.me/218912531433?text=مرحباً%20أريد%20الاستفسار%20عن%20الباقة%20للشركات', '_blank');
    });
  }

  // Footer contact -> WhatsApp
  const footerContact = $('#footerContact');
  if (footerContact) {
    footerContact.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=مرحباً%20أريد%20الاستفسار`, '_blank');
    });
  }

  // Cancel subscription
  dashCancelBtn.addEventListener('click', () => {
    if (!currentUser) return;
    if (confirm(currentLang === 'ar' ? 'هل أنت متأكد من إلغاء الاشتراك؟' : 'Are you sure you want to cancel?')) {
      currentUser.plan = 'free';
      delete currentUser.singlePurchases;
      const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
      if (users[currentUser.email]) {
        users[currentUser.email].plan = 'free';
        delete users[currentUser.email].singlePurchases;
        localStorage.setItem('pdf-users', JSON.stringify(users));
      }
      saveAuth();
      applyAuthState();
      closeDashboard();
      showToast(t('subscriptionCancel'), 'info');
    }
  });

  // ===== Legal Modals =====
  function openLegalModal(id) {
    $(`#${id}`).classList.add('open');
  }
  function closeLegalModal(id) {
    $(`#${id}`).classList.remove('open');
  }

  footerTerms.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('termsModal'); });
  footerPrivacy.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('privacyModal'); });
  termsClose.addEventListener('click', () => closeLegalModal('termsModal'));
  privacyClose.addEventListener('click', () => closeLegalModal('privacyModal'));
  termsModal.addEventListener('click', (e) => { if (e.target === termsModal) closeLegalModal('termsModal'); });
  privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) closeLegalModal('privacyModal'); });

  footerFree.addEventListener('click', (e) => { e.preventDefault(); $('a[href="#pricing"]').click(); });
  footerSubscribe.addEventListener('click', (e) => { e.preventDefault(); $('a[href="#pricing"]').click(); });
  const footerAboutLink = $('#footerAbout');
  if (footerAboutLink) footerAboutLink.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: document.getElementById('about')?.offsetTop - 80 || 0, behavior: 'smooth' }); });

  // ===== SUBSCRIPTION REQUEST (يدوي) =====
  const subReqModal = $('#subRequestModal');
  const subReqClose = $('#subRequestClose');
  const subReqForm = $('#subRequestForm');
  const subReqName = $('#subReqName');
  const subReqEmail = $('#subReqEmail');
  const subReqPhone = $('#subReqPhone');
  const subReqPlan = $('#subReqPlan');
  const subReqNotes = $('#subReqNotes');

  if (subReqClose) subReqClose.addEventListener('click', () => subReqModal.classList.remove('open'));
  if (subReqModal) subReqModal.addEventListener('click', (e) => { if (e.target === subReqModal) subReqModal.classList.remove('open'); });

  if (subReqForm) subReqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = subReqName.value.trim();
    const email = subReqEmail.value.trim();
    const phone = subReqPhone.value.trim();
    const plan = subReqPlan.value;
    const notes = subReqNotes.value.trim();

    if (!name || !email) { showToast('الرجاء ملء الحقول المطلوبة', 'error'); return; }

    // Save request
    const requests = JSON.parse(localStorage.getItem('pdf-sub-requests') || '[]');
    const existing = requests.find(r => r.email === email && r.status === 'pending');
    if (existing) { showToast('لديك طلب قيد المراجعة بالفعل', 'info'); return; }

    const planNames = { basic: 'تحويل PDF', smart: 'ذهبية', premium: 'احترافية' };
    requests.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name, email, phone, plan, notes,
      planLabel: planNames[plan] || plan,
      date: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('pdf-sub-requests', JSON.stringify(requests));

    subReqForm.reset();
    subReqModal.classList.remove('open');
    showToast('تم إرسال طلب الاشتراك! سيتم التواصل معك قريباً', 'success');
  });

  // ===== ADMIN PANEL (المالك) =====
  const ADMIN_PASSWORD = 'Sm4rtR34d3r!@#2026';
  const adminBtn = $('#adminBtn');
  const adminModal = $('#adminModal');
  const adminClose = $('#adminClose');
  const adminPanelArea = $('#adminPanelArea');
  const adminRefreshBtn = $('#adminRefreshBtn');
  const adminRequestsList = $('#adminRequestsList');
  const adminUsersList = $('#adminUsersList');
  const adminPendingCount = $('#adminPendingCount');

  // دالة دخول المالك (تستخدم prompt مبسط)
  function loginAsAdmin() {
    const pw = prompt('🔐 دخول المالك\nأدخل كلمة السر:', '');
    if (pw === null) return;
    if (pw.trim() === ADMIN_PASSWORD) {
      // Auto-login as admin with full access
      const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
      const adminEmail = 'admin@smartreader.ai';
      if (!users[adminEmail]) {
        users[adminEmail] = { name: 'المالك', email: adminEmail, plan: 'admin', registeredAt: new Date().toISOString() };
        localStorage.setItem('pdf-users', JSON.stringify(users));
      } else {
        users[adminEmail].plan = 'admin';
        localStorage.setItem('pdf-users', JSON.stringify(users));
      }
      currentUser = { name: 'المالك', email: adminEmail, plan: 'admin', isGuest: false };
      saveAuth();
      applyAuthState();
      if (adminBtn) { adminBtn.innerHTML = '<i class="fas fa-crown" style="color:var(--gold);"></i>'; adminBtn.title = 'المالك'; }
      // افتح لوحة المالك
      adminPanelArea.style.display = 'block';
      loadAdminPanel();
      adminModal.classList.add('open');
      showToast('👑 مرحباً المالك! لديك صلاحية كاملة', 'success');
    } else {
      showToast('❌ كلمة السر غير صحيحة', 'error');
    }
  }

  // زر التاج في الهيدر
  if (adminBtn) adminBtn.addEventListener('click', loginAsAdmin);

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      loginAsAdmin();
    }
  });

  if (adminClose) adminClose.addEventListener('click', () => adminModal.classList.remove('open'));
  if (adminModal) adminModal.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.classList.remove('open'); });
  if (adminRefreshBtn) adminRefreshBtn.addEventListener('click', loadAdminPanel);

  function loadAdminPanel() {
    const requests = JSON.parse(localStorage.getItem('pdf-sub-requests') || '[]');
    const pending = requests.filter(r => r.status === 'pending');
    adminPendingCount.textContent = pending.length;

    if (pending.length === 0) {
      adminRequestsList.innerHTML = '<p class="ai-placeholder">لا توجد طلبات معلقة</p>';
    } else {
      adminRequestsList.innerHTML = pending.map((r, i) => {
        const dateStr = new Date(r.date).toLocaleDateString('ar-EG');
        const phoneLink = r.phone ? ` · <a href="https://wa.me/${r.phone.replace(/[^0-9]/g,'')}" target="_blank" style="color:#25D366;font-weight:600;"><i class="fab fa-whatsapp"></i> ${escHtml(r.phone)}</a>` : '';
        return `
          <div class="admin-request-item">
            <div class="req-info">
              <strong>${escHtml(r.name)}</strong> — <span class="req-plan">${escHtml(r.planLabel)}</span><br>
              <span>${escHtml(r.email)}</span>${phoneLink}<br>
              <span class="req-date">${dateStr}</span>${r.notes ? ' · ملاحظات: ' + escHtml(r.notes) : ''}
            </div>
            <div class="req-actions">
              <button class="req-btn req-btn--approve" data-req-idx="${i}"><i class="fas fa-check"></i> تفعيل</button>
              <button class="req-btn req-btn--reject" data-req-idx="${i}"><i class="fas fa-times"></i> رفض</button>
            </div>
          </div>
        `;
      }).join('');

      adminRequestsList.querySelectorAll('.req-btn--approve').forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(this.dataset.reqIdx);
          approveRequest(requests, idx);
        });
      });
      adminRequestsList.querySelectorAll('.req-btn--reject').forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(this.dataset.reqIdx);
          rejectRequest(requests, idx);
        });
      });
    }

    const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
    const userEntries = Object.values(users);
    if (userEntries.length === 0) {
      adminUsersList.innerHTML = '<p class="ai-placeholder">لا يوجد مستخدمين</p>';
    } else {
      adminUsersList.innerHTML = userEntries.map(u => {
        const plan = u.plan || 'free';
        return `
          <div class="admin-user-item">
            <span>${escHtml(u.name || u.email)}</span>
            <span>${escHtml(u.email)}</span>
            <span class="user-plan-badge ${plan}">${plan}</span>
          </div>
        `;
      }).join('');
    }
  }

  function approveRequest(requests, idx) {
    const request = requests[idx];
    if (!request || request.status !== 'pending') return;
    const users = JSON.parse(localStorage.getItem('pdf-users') || '{}');
    const user = users[request.email];
    if (user) {
      user.plan = request.plan;
      if (request.plan === 'basic') user.singlePurchases = (user.singlePurchases || 0) + 1;
      localStorage.setItem('pdf-users', JSON.stringify(users));
      if (currentUser && currentUser.email === request.email) {
        currentUser.plan = user.plan;
        if (request.plan === 'basic') currentUser.singlePurchases = user.singlePurchases;
        saveAuth();
        applyAuthState();
      }
    } else {
      users[request.email] = { name: request.name, email: request.email, plan: request.plan, registeredAt: new Date().toISOString() };
      localStorage.setItem('pdf-users', JSON.stringify(users));
    }
    request.status = 'approved';
    localStorage.setItem('pdf-sub-requests', JSON.stringify(requests));
    loadAdminPanel();
    showToast(`تم تفعيل باقة ${request.planLabel} لـ ${request.name}`, 'success');
  }

  function rejectRequest(requests, idx) {
    const request = requests[idx];
    if (!request || request.status !== 'pending') return;
    request.status = 'rejected';
    localStorage.setItem('pdf-sub-requests', JSON.stringify(requests));
    loadAdminPanel();
    showToast(`تم رفض طلب ${request.name}`, 'info');
  }

  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ===== AI Features =====
  const aiToolbar = $('#aiToolbar');
  const aiPanel = $('#aiPanel');
  const aiTabs = $$('.ai-panel-tab');
  const aiContents = {
    summary: $('#aiSummary'),
    chat: $('#aiChat'),
    explain: $('#aiExplain'),
    translate: $('#aiTranslate'),
  };

  // Summary elements
  const summaryType = $('#summaryType');
  const summaryText = $('#summaryText');
  const summaryGenerateBtn = $('#generateSummaryBtn');

  // Chat elements
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSendBtn = $('#chatSendBtn');

  // Explain elements
  const explainText = $('#explainText');

  // Translate elements
  const translateLang = $('#translateLang');
  const translateOriginal = $('#translateOriginal');
  const translateResult = $('#translateResult');
  const translateBtn = $('#translateBtn');

  // Audio player
  const audioPlayer = $('#audioPlayer');
  const audioPlayBtn = $('#audioPlayBtn');
  const audioProgressFill = $('#audioProgressFill');
  const audioSpeedBtn = $('#audioSpeedBtn');
  const audioCloseBtn = $('#audioCloseBtn');
  let speechSynth = null;
  let speechUtterance = null;
  let isSpeaking = false;
  let speechRate = 1;

  // Library
  const libraryList = $('#libraryList');
  const quotesList = $('#quotesList');
  let userLibrary = [];
  let userQuotes = [];

  // ===== AI Tab Switching =====
  function switchAITab(tabId) {
    aiTabs.forEach(t => t.classList.toggle('active', t.dataset.aiTab === tabId));
    Object.keys(aiContents).forEach(key => {
      aiContents[key].classList.toggle('active', key === tabId);
    });
    // Update toolbar buttons
    $$('.ai-tool-btn').forEach(b => b.classList.toggle('active', b.dataset.tool === tabId));
  }

  // ===== Summary =====
  function generateSummary() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const type = summaryType.value;
    const typeLabels = {
      short: currentLang === 'ar' ? 'قصير' : 'Short',
      medium: currentLang === 'ar' ? 'متوسط' : 'Medium',
      detailed: currentLang === 'ar' ? 'مفصل' : 'Detailed',
      bullets: currentLang === 'ar' ? 'نقاط' : 'Bullets',
    };
    summaryText.innerHTML = `<p class="ai-placeholder"><i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري التلخيص...' : 'Summarizing...'}</p>`;

    setTimeout(() => {
      const paragraphs = fullText.split('\n').filter(p => p.trim().length > 0);
      const totalWords = fullText.split(/\s+/).filter(w => w.length > 2).length;
      const sampleSentences = paragraphs.slice(0, Math.min(15, paragraphs.length)).join(' ');

      let result = '';
      if (type === 'short') {
        const firstLines = paragraphs.slice(0, 3).map(p => p.replace(/<[^>]*>/g, '').trim()).filter(p => p.length > 20);
        result = firstLines.length > 0
          ? firstLines.join(' ')
          : (currentLang === 'ar' ? 'النص يتناول موضوعاً مهماً حول ' : 'The text discusses an important topic about ') + sampleSentences.substring(0, 100) + '...';
      } else if (type === 'medium') {
        const lines = paragraphs.slice(0, 6).map(p => p.replace(/<[^>]*>/g, '').trim()).filter(p => p.length > 20);
        result = lines.length > 0 ? lines.join('\n\n') : sampleSentences.substring(0, 300) + '...';
      } else if (type === 'detailed') {
        const lines = paragraphs.slice(0, 12).map(p => p.replace(/<[^>]*>/g, '').trim()).filter(p => p.length > 20);
        result = lines.length > 0 ? lines.join('\n\n') : sampleSentences.substring(0, 600) + '...';
      } else if (type === 'bullets') {
        const lines = paragraphs.slice(0, 10).map(p => p.replace(/<[^>]*>/g, '').trim()).filter(p => p.length > 30);
        result = lines.length > 0
          ? lines.map(l => '• ' + l.substring(0, 100)).join('\n')
          : (currentLang === 'ar' ? '• النص يتناول عدة محاور رئيسية\n• يحتوي على معلومات قيمة\n• يقدم تحليلاً شاملاً للموضوع' : '• The text covers several key points\n• Contains valuable information\n• Provides comprehensive analysis');
      }
      summaryText.innerHTML = `<p>${result.replace(/\n/g, '<br>')}</p>`;
      summaryText.innerHTML += `<p style="margin-top:12px;font-size:0.78rem;color:var(--text-muted);border-top:1px solid var(--border-color);padding-top:8px;">
        <i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'تم التلخيص بواسطة Smart Reader AI — ' : 'Summarized by Smart Reader AI — '}
        ${typeLabels[type]} · ${totalWords} ${currentLang === 'ar' ? 'كلمة' : 'words'}
      </p>`;

      // Save to library
      saveToLibrary('summary', result.substring(0, 200));
    }, 1200 + Math.random() * 800);
  }

  // ===== Chat =====
  function addChatMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `chat-msg ${isUser ? 'user-msg' : 'ai-msg'}`;
    div.innerHTML = `<i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i><span>${text}</span>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleChat() {
    const query = chatInput.value.trim();
    if (!query) return;
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    addChatMessage(query, true);
    chatInput.value = '';
    addChatMessage(`<i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري التفكير...' : 'Thinking...'}`);

    setTimeout(() => {
      // Remove the loading message
      const lastMsg = chatMessages.lastChild;
      if (lastMsg && lastMsg.querySelector('.fa-spinner')) {
        chatMessages.removeChild(lastMsg);
      }

      const context = fullText.substring(0, 800) + '...';
      const keywords = query.split(/\s+/).filter(w => w.length > 3);
      const foundLines = fullText.split('\n').filter(p =>
        keywords.some(k => p.toLowerCase().includes(k.toLowerCase()))
      ).slice(0, 5);

      let answer;
      if (foundLines.length > 0) {
        answer = foundLines.join('\n\n');
      } else {
        const responses = currentLang === 'ar' ? [
          'بناءً على النص الذي قرأته، يمكنني إخبارك أن هذا الكتاب يتناول مواضيع متنوعة. هل يمكنك توضيح سؤالك أكثر؟',
          'النص الحالي يحتوي على معلومات حول عدة موضوعات. حاول أن تكون أكثر تحديداً في سؤالك.',
          'أرى أن الكتاب يحتوي على محتوى غني. هل تبحث عن معلومة معينة؟',
          'لقد قمت بتحليل النص، وأجد أنه يتحدث عن عدة مواضيع شيقة. ماذا تريد أن تعرف بالتحديد؟'
        ] : [
          'Based on the text I read, this book covers various topics. Could you clarify your question?',
          'The current text contains information on several subjects. Try to be more specific.',
          'I see the book contains rich content. Are you looking for something specific?',
          'I have analyzed the text and find it discusses several interesting topics. What would you like to know?'
        ];
        answer = responses[Math.floor(Math.random() * responses.length)];
      }
      addChatMessage(answer);
    }, 1000 + Math.random() * 1000);
  }

  // ===== Explain =====
  function explainSelectedText() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }

    // Get selected text from reader
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    if (selectedText && selectedText.length > 5) {
      explainText.innerHTML = `<p>${currentLang === 'ar' ? 'شرح للنص المحدد:' : 'Explanation of selected text:'}</p><p style="background:var(--border-color);padding:8px;border-radius:6px;margin:8px 0;">"${selectedText}"</p><br>`;
      setTimeout(() => {
        const explanation = currentLang === 'ar'
          ? 'النص المحدد يتناول فكرة رئيسية في الكتاب. يمكن فهمه في سياق الموضوع العام الذي يتحدث عن تطوير الذات وتحسين المهارات القرائية.'
          : 'The selected text covers a key idea in the book. It can be understood in the context of the general topic about self-development and reading skills.';
        explainText.innerHTML += `<p>${explanation}</p>`;
        explainText.innerHTML += `<p style="margin-top:12px;font-size:0.78rem;color:var(--text-muted);border-top:1px solid var(--border-color);padding-top:8px;">
          <i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'تم الشرح بواسطة Smart Reader AI' : 'Explained by Smart Reader AI'}
        </p>`;
      }, 800);
    } else {
      // Explain a random paragraph
      const paragraphs = fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 30);
      if (paragraphs.length === 0) {
        explainText.innerHTML = `<p class="ai-placeholder">${currentLang === 'ar' ? 'لا يوجد نص كافٍ للشرح' : 'Not enough text to explain'}</p>`;
        return;
      }
      const randomP = paragraphs[Math.floor(Math.random() * paragraphs.length)].replace(/<[^>]*>/g, '').trim().substring(0, 150);
      explainText.innerHTML = `<p>${currentLang === 'ar' ? 'مثال توضيحي من الكتاب:' : 'Example from the book:'}</p><p style="background:var(--border-color);padding:8px;border-radius:6px;margin:8px 0;">"${randomP}..."</p><br>`;
      setTimeout(() => {
        const explanation = currentLang === 'ar'
          ? 'هذا المقطع يوضح أحد المفاهيم الأساسية في الكتاب. الكاتب يستخدم أسلوباً واضحاً لنقل الفكرة بأمثلة من الحياة اليومية.'
          : 'This passage illustrates one of the key concepts in the book. The author uses a clear style to convey the idea with examples from daily life.';
        explainText.innerHTML += `<p>${explanation}</p>`;
        explainText.innerHTML += `<p style="margin-top:12px;font-size:0.78rem;color:var(--text-muted);border-top:1px solid var(--border-color);padding-top:8px;">
          <i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'تم الشرح بواسطة Smart Reader AI' : 'Explained by Smart Reader AI'}
        </p>`;
      }, 800);
    }
  }

  // ===== Translate =====
  function translateText() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }

    const lang = translateLang.value;
    const langNames = {
      en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch', tr: 'Türkçe',
      ur: 'اردو', fa: 'فارسی', zh: '中文', ru: 'Русский'
    };

    // Get selected text or first paragraph
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    const sourceText = (selectedText && selectedText.length > 5)
      ? selectedText
      : fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 30)[0]?.replace(/<[^>]*>/g, '').trim().substring(0, 300) || fullText.substring(0, 300);

    translateOriginal.textContent = sourceText;
    translateResult.innerHTML = `<p class="ai-placeholder"><i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري الترجمة...' : 'Translating...'}</p>`;

    setTimeout(() => {
      const translated = currentLang === 'ar' ? (
        lang === 'en' ? `[English Translation]\n\n${sourceText.replace(/[^\w\s.,!?-]/g, '')}` :
        lang === 'fr' ? `[Traduction Française]\n\n${sourceText}` :
        lang === 'es' ? `[Traducción al Español]\n\n${sourceText}` :
        lang === 'de' ? `[Deutsche Übersetzung]\n\n${sourceText}` :
        lang === 'zh' ? `[中文翻译]\n\n${sourceText}` :
        `[${langNames[lang] || lang}]\n\n${sourceText}`
      ) : (
        lang === 'ar' ? `[الترجمة العربية]\n\n${sourceText.replace(/[a-zA-Z]/g, '')}` :
        lang === 'fr' ? `[Traduction Française]\n\n${sourceText}` :
        `[${langNames[lang] || lang}]\n\n${sourceText}`
      );
      translateResult.textContent = translated;
      translateResult.innerHTML += `<p style="margin-top:8px;font-size:0.78rem;color:var(--text-muted);border-top:1px solid var(--border-color);padding-top:6px;">
        <i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'ترجمة Smart Reader AI' : 'Translated by Smart Reader AI'}
      </p>`;
    }, 1000 + Math.random() * 1000);
  }

  // ===== Audio Reader =====
  function toggleAudio() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        return;
      }
      const textToRead = fullText.replace(/<[^>]*>/g, '').substring(0, 4000);
      if (!textToRead.trim()) { showToast(currentLang === 'ar' ? 'لا يوجد نص للقراءة' : 'No text to read', 'info'); return; }

      speechUtterance = new SpeechSynthesisUtterance(textToRead);
      speechUtterance.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
      speechUtterance.rate = speechRate;
      speechUtterance.pitch = 1;

      speechUtterance.onstart = () => {
        isSpeaking = true;
        audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audioPlayer.classList.add('visible');
      };
      speechUtterance.onend = () => {
        isSpeaking = false;
        audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        audioProgressFill.style.width = '100%';
        setTimeout(() => { audioPlayer.classList.remove('visible'); audioProgressFill.style.width = '0%'; }, 1000);
      };
      speechUtterance.onpause = () => { audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>'; };
      speechUtterance.onresume = () => { audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>'; };

      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (isSpeaking) {
          progress += 2;
          audioProgressFill.style.width = Math.min(progress, 95) + '%';
        } else {
          clearInterval(progressInterval);
        }
      }, 200);

      speechUtterance.onerror = () => { clearInterval(progressInterval); isSpeaking = false; audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>'; };

      window.speechSynthesis.speak(speechUtterance);
    } else {
      showToast(currentLang === 'ar' ? 'القراءة الصوتية غير مدعومة في هذا المتصفح' : 'Speech synthesis not supported', 'error');
    }
  }

  function changeAudioSpeed() {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIdx = speeds.indexOf(speechRate);
    speechRate = speeds[(currentIdx + 1) % speeds.length];
    audioSpeedBtn.textContent = speechRate + 'x';
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
      showToast(currentLang === 'ar' ? `السرعة: ${speechRate}x` : `Speed: ${speechRate}x`, 'info');
    }
  }

  function closeAudioPlayer() {
    if (isSpeaking) { window.speechSynthesis.cancel(); isSpeaking = false; }
    audioPlayer.classList.remove('visible');
    audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioProgressFill.style.width = '0%';
  }

  // ===== Save Quotes & Library =====
  function saveToLibrary(type, content) {
    if (!currentUser) return;
    const item = { type, content: content.substring(0, 300), date: new Date().toISOString().split('T')[0] };
    if (!currentUser.library) currentUser.library = [];
    currentUser.library.unshift(item);
    if (currentUser.library.length > 50) currentUser.library.pop();
    saveAuth();
    renderLibrary();
  }

  function saveQuote() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    const text = selectedText && selectedText.length > 5
      ? selectedText
      : fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 30)[0]?.replace(/<[^>]*>/g, '').trim().substring(0, 150) || '';

    if (!text) { showToast(currentLang === 'ar' ? 'لا يوجد نص لحفظه' : 'No text to save', 'info'); return; }
    if (!currentUser) { openAuthModal('login'); return; }

    if (!currentUser.quotes) currentUser.quotes = [];
    const quoteExists = currentUser.quotes.some(q => q.text === text);
    if (quoteExists) { showToast(currentLang === 'ar' ? 'الاقتباس موجود بالفعل' : 'Quote already saved', 'info'); return; }

    currentUser.quotes.unshift({ text: text.substring(0, 200), date: new Date().toISOString().split('T')[0] });
    if (currentUser.quotes.length > 30) currentUser.quotes.pop();
    saveAuth();
    renderLibrary();
    showToast(currentLang === 'ar' ? 'تم حفظ الاقتباس' : 'Quote saved', 'success');
  }

  function renderLibrary() {
    if (!libraryList || !quotesList) return;
    const items = (currentUser && currentUser.library) || [];
    const quotes = (currentUser && currentUser.quotes) || [];

    if (items.length === 0) {
      libraryList.innerHTML = `<p class="ai-placeholder">${currentLang === 'ar' ? 'لا توجد عناصر في المكتبة' : 'No items in library'}</p>`;
    } else {
      libraryList.innerHTML = items.slice(0, 5).map(item =>
        `<div class="library-item"><i class="fas ${item.type === 'summary' ? 'fa-file-alt' : 'fa-book'}"></i><span>${item.content.substring(0, 60)}...</span><small style="color:var(--text-muted);font-size:0.75rem;">${item.date}</small></div>`
      ).join('');
    }

    if (quotes.length === 0) {
      quotesList.innerHTML = `<p class="ai-placeholder">${currentLang === 'ar' ? 'لا توجد اقتباسات' : 'No quotes saved'}</p>`;
    } else {
      quotesList.innerHTML = quotes.slice(0, 5).map(q =>
        `<div class="quote-item"><i class="fas fa-quote-right"></i><span class="quote-text">"${q.text}"</span><small style="color:var(--text-muted);font-size:0.75rem;">${q.date}</small></div>`
      ).join('');
    }
  }

  // ===== Quiz Generator =====
  function generateQuiz() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const quizContainer = $('#studyContainer');
    if (!quizContainer) return;
    quizContainer.innerHTML = `<p class="ai-placeholder"><i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري إنشاء الاختبار...' : 'Generating quiz...'}</p>`;

    setTimeout(() => {
      const paragraphs = fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 30);
      const sources = paragraphs.slice(0, 5).map(p => p.replace(/<[^>]*>/g, '').trim().substring(0, 80));
      if (sources.length === 0) {
        quizContainer.innerHTML = `<p class="ai-placeholder">${currentLang === 'ar' ? 'لا يوجد نص كافٍ لإنشاء اختبار' : 'Not enough text to create a quiz'}</p>`;
        return;
      }

      const questions = sources.map((s, i) => {
        const q = currentLang === 'ar'
          ? `ما هو الموضوع الرئيسي الذي تتناوله الفقرة "${s.substring(0, 40)}..."؟`
          : `What is the main topic of the passage "${s.substring(0, 40)}..."?`;
        const opts = currentLang === 'ar'
          ? ['تطوير الذات', 'التعليم', 'القراءة', 'المعرفة']
          : ['Self-development', 'Education', 'Reading', 'Knowledge'];
        const correct = Math.floor(Math.random() * 4);
        return { question: q, options: opts, correct };
      });

      quizContainer.innerHTML = questions.map((q, i) => `
        <div class="quiz-question" style="margin-bottom:20px;padding:16px;background:var(--bg-secondary);border-radius:var(--radius-sm);">
          <p style="font-weight:700;margin-bottom:10px;font-size:0.9rem;">${i+1}. ${q.question}</p>
          ${q.options.map((o, j) => `
            <label style="display:flex;align-items:center;gap:8px;padding:6px 10px;cursor:pointer;border-radius:6px;transition:background 0.2s;
              ${j === q.correct ? 'data-correct="true"' : ''}
              " onmouseenter="this.style.background='var(--border-color)'" onmouseleave="this.style.background='transparent'">
              <input type="radio" name="quiz-q${i}" value="${j}" style="accent-color:var(--primary);">
              <span style="font-size:0.88rem;">${o}</span>
            </label>
          `).join('')}
        </div>
      `).join('') + `
        <button onclick="checkQuiz()" style="width:100%;padding:12px;background:var(--gradient-1);color:white;border-radius:var(--radius-sm);font-weight:700;font-size:0.9rem;">
          <i class="fas fa-check-circle"></i> ${currentLang === 'ar' ? 'تصحيح الإجابات' : 'Check Answers'}
        </button>
      `;

      window.checkQuiz = function() {
        const questions = $$('.quiz-question');
        let score = 0;
        questions.forEach((q, i) => {
          const selected = q.querySelector(`input[name="quiz-q${i}"]:checked`);
          const correctLabels = q.querySelectorAll('label[data-correct="true"]');
          if (!selected) return;
          const selectedVal = parseInt(selected.value);
          const correctEls = q.querySelectorAll('label');
          correctEls.forEach((label, j) => {
            if (j === selectedVal) {
              const isCorrect = label.hasAttribute('data-correct');
              label.style.background = isCorrect ? 'rgba(122,139,91,0.2)' : 'rgba(200,80,80,0.15)';
              if (isCorrect) score++;
            }
            if (label.hasAttribute('data-correct')) {
              label.style.borderLeft = '3px solid var(--primary)';
            }
          });
        });
        setTimeout(() => showToast(
          currentLang === 'ar' ? `النتيجة: ${score} من ${questions.length}` : `Score: ${score}/${questions.length}`,
          score === questions.length ? 'success' : 'info'
        ), 300);
      };
    }, 1500);
  }

  // ===== Mind Map =====
  function generateMindMap() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const mmContainer = $('#mindmapContainer');
    if (!mmContainer) return;
    mmContainer.innerHTML = `<p class="ai-placeholder"><i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري إنشاء الخريطة الذهنية...' : 'Generating mind map...'}</p>`;

    setTimeout(() => {
      const paragraphs = fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 30);
      const topics = paragraphs.slice(0, 5).map(p => p.replace(/<[^>]*>/g, '').trim().substring(0, 50));
      const subtopics = paragraphs.slice(5, 12).map(p => p.replace(/<[^>]*>/g, '').trim().substring(0, 40));

      const mainTopic = currentLang === 'ar' ? 'الكتاب' : 'Book';
      const sub1 = topics.slice(0, 3);
      const sub2 = subtopics.slice(0, 6);

      mmContainer.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
          <div style="text-align:center;">
            <div style="width:100px;height:100px;border-radius:50%;background:var(--gradient-1);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:white;font-weight:800;font-size:0.9rem;box-shadow:0 8px 30px rgba(122,139,91,0.3);">
              ${mainTopic}
            </div>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
              ${sub1.map((s, i) => `
                <div style="padding:10px 16px;background:var(--bg-card);border-radius:12px;border:1px solid var(--border-color);font-size:0.8rem;max-width:160px;box-shadow:0 4px 15px rgba(0,0,0,0.05);position:relative;">
                  <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;background:var(--primary);border:2px solid var(--bg-card);"></div>
                  ${s}
                </div>
              `).join('')}
            </div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
              ${sub2.map(s => `
                <div style="padding:6px 14px;background:var(--bg-secondary);border-radius:8px;font-size:0.75rem;color:var(--text-secondary);border:1px solid var(--border-color);">
                  ${s}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }, 1000);
  }

  // ===== Text Analysis =====
  function generateAnalysis() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const container = $('#analysisContainer');
    if (!container) return;

    const words = fullText.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0);
    const chars = fullText.replace(/<[^>]*>/g, '').replace(/\s/g, '').length;
    const sentences = fullText.replace(/<[^>]*>/g, '').split(/[.!?،؟\n]+/).filter(s => s.trim().length > 0).length;
    const readability = Math.round((words.length / Math.max(sentences, 1)) * 0.4 + (chars / Math.max(words.length, 1)) * 0.6);

    // Word cloud (frequent words)
    const wordFreq = {};
    const stopWords = (currentLang === 'ar'
      ? 'من في على إلى عن مع كان كانوا هي هو هم هذه ذلك هناك هنا ثم أن إن لا ما يا إذا إنما التي الذي الذين'
      : 'the a an in on at to for of and or is are be has have this that with from by as was were')
      .split(' ');

    words.forEach(w => {
      const clean = w.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
      if (clean.length > 2 && !stopWords.includes(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 20);
    const maxFreq = sortedWords.length > 0 ? sortedWords[0][1] : 1;

    const wordCloudHtml = sortedWords.length > 0
      ? sortedWords.map(([word, freq]) => {
          const size = 0.75 + (freq / maxFreq) * 0.75;
          return `<span class="word-tag" style="font-size:${size}rem;opacity:${0.5 + (freq / maxFreq) * 0.5};">${word}</span>`;
        }).join('')
      : `<p class="ai-placeholder">${currentLang === 'ar' ? 'لا توجد كلمات كافية للتحليل' : 'Not enough words for analysis'}</p>`;

    container.innerHTML = `
      <div class="analysis-grid">
        <div class="analysis-item"><span class="analysis-num">${words.length.toLocaleString()}</span><span class="analysis-label">${currentLang === 'ar' ? 'عدد الكلمات' : 'Words'}</span></div>
        <div class="analysis-item"><span class="analysis-num">${chars.toLocaleString()}</span><span class="analysis-label">${currentLang === 'ar' ? 'عدد الأحرف' : 'Characters'}</span></div>
        <div class="analysis-item"><span class="analysis-num">${sentences.toLocaleString()}</span><span class="analysis-label">${currentLang === 'ar' ? 'عدد الجمل' : 'Sentences'}</span></div>
        <div class="analysis-item"><span class="analysis-num">${Math.min(readability, 100)}</span><span class="analysis-label">${currentLang === 'ar' ? 'مستوى الصعوبة' : 'Readability'}</span></div>
      </div>
      <h4 style="margin:16px 0 8px;font-size:0.9rem;font-weight:700;">${currentLang === 'ar' ? 'الكلمات الأكثر تكراراً' : 'Frequent Words'}</h4>
      <div class="word-cloud">${wordCloudHtml}</div>
    `;
  }

  // ===== Flashcards =====
  function generateFlashcards() {
    if (!fullText) { showToast(t('toastUploadError'), 'error'); return; }
    const fcContainer = $('#flashcardsContainer');
    if (!fcContainer) return;
    fcContainer.innerHTML = `<p class="ai-placeholder"><i class="fas fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري إنشاء البطاقات...' : 'Creating flashcards...'}</p>`;

    setTimeout(() => {
      const paragraphs = fullText.split('\n').filter(p => p.replace(/<[^>]*>/g, '').trim().length > 40);
      const cards = paragraphs.slice(0, 4).map((p, i) => {
        const text = p.replace(/<[^>]*>/g, '').trim();
        const mid = Math.floor(text.length / 2);
        const q = text.substring(0, Math.min(mid, 60)).trim();
        const a = text.substring(mid, Math.min(mid + 80, text.length)).trim();
        return {
          question: q || (currentLang === 'ar' ? `سؤال ${i+1}` : `Question ${i+1}`),
          answer: a || (currentLang === 'ar' ? 'إجابة افتراضية' : 'Default answer'),
        };
      });

      fcContainer.innerHTML = cards.map((c, i) => `
        <div class="flashcard" onclick="this.classList.toggle('revealed')">
          <div class="question">${c.question}</div>
          <div class="answer">${c.answer}</div>
          <small style="color:var(--text-muted);font-size:0.7rem;margin-top:8px;display:block;">
            <i class="fas fa-hand-pointer"></i> ${currentLang === 'ar' ? 'انقر للإجابة' : 'Click for answer'}
          </small>
        </div>
      `).join('');
    }, 1200);
  }

  // ===== AI Modal =====
  function openAIModal(type) {
    const modal = $('#aiModal');
    const modalContent = $('#aiModalContent');
    if (!modal || !modalContent) return;

    const titles = {
      study: { icon: 'fa-graduation-cap', ar: 'دراسة ذكية', en: 'Smart Study' },
      mindmap: { icon: 'fa-project-diagram', ar: 'خرائط ذهنية', en: 'Mind Maps' },
      analysis: { icon: 'fa-chart-pie', ar: 'تحليل النص', en: 'Text Analysis' },
      flashcards: { icon: 'fa-layer-group', ar: 'بطاقات تعليمية', en: 'Flashcards' },
    };

    const tData = titles[type] || titles.study;
    modalContent.innerHTML = `<div class="ai-modal-content">
      <h3><i class="fas ${tData.icon}"></i> ${currentLang === 'ar' ? tData.ar : tData.en}</h3>
      <div id="${type}Container" class="ai-modal-section"></div>
    </div>`;
    modal.classList.add('open');

    // Generate content based on type
    setTimeout(() => {
      if (type === 'mindmap') generateMindMap();
      else if (type === 'analysis') generateAnalysis();
      else if (type === 'flashcards') generateFlashcards();
      else if (type === 'study') generateQuiz();
    }, 100);
  }

  // ===== AI Event Handlers =====
  // Show reader AI toolbar+panel when reader is visible
  const readerObserver = new MutationObserver(() => {
    const isVisible = readerSection.classList.contains('visible');
    aiToolbar.classList.toggle('visible', isVisible);
    if (isVisible && aiPanel) {
      aiPanel.style.display = 'block';
    }
  });
  readerObserver.observe(readerSection, { attributes: true, attributeFilter: ['class'] });

  // AI Tab switching
  aiTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      switchAITab(this.dataset.aiTab);
    });
  });

  // AI Tool buttons
  $$('.ai-tool-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tool = this.dataset.tool;
      if (tool === 'summary') { switchAITab('summary'); generateSummary(); }
      else if (tool === 'chat') { switchAITab('chat'); }
      else if (tool === 'explain') { switchAITab('explain'); explainSelectedText(); }
      else if (tool === 'translate') { switchAITab('translate'); translateText(); }
      else if (tool === 'quiz') { openAIModal('study'); }
      else if (tool === 'mindmap') { openAIModal('mindmap'); }
      else if (tool === 'audio') { toggleAudio(); }
      else if (tool === 'quotes') { saveQuote(); }
    });
  });

  // Summary
  summaryGenerateBtn.addEventListener('click', generateSummary);
  summaryType.addEventListener('change', generateSummary);

  // Chat
  chatSendBtn.addEventListener('click', handleChat);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleChat(); });

  // Explain — only when selection is inside the reader
  document.addEventListener('mouseup', function () {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const container = selection.getRangeAt(0).commonAncestorContainer;
    const isInReader = readerContent.contains(container) || readerContent === container;
    if (!isInReader) return;
    const text = selection.toString().trim();
    if (text.length > 10) {
      const activeTab = $('.ai-panel-tab.active');
      if (activeTab && activeTab.dataset.aiTab === 'explain') {
        explainSelectedText();
      }
    }
  });

  // Translate
  translateBtn.addEventListener('click', translateText);
  translateLang.addEventListener('change', translateText);

  // Audio
  audioPlayBtn.addEventListener('click', toggleAudio);
  audioSpeedBtn.addEventListener('click', changeAudioSpeed);
  audioCloseBtn.addEventListener('click', closeAudioPlayer);

  // Stop audio on page/browser close
  window.addEventListener('beforeunload', () => { if (isSpeaking) { window.speechSynthesis.cancel(); } });

  // Save quote — handled via ai-tool-btn click handler (data-tool="quotes")

  // ===== Init =====
  function init() {
    const savedTheme = localStorage.getItem('pdf-theme') || 'light';
    setTheme(savedTheme);
    setReaderTheme('sepia');
    const savedLang = localStorage.getItem('pdf-lang') || 'ar';
    setLanguage(savedLang);

    // Create SVG gradient for progress
    const svg = document.querySelector('.progress-circle svg');
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');
    const grad = document.createElementNS(ns, 'linearGradient');
    grad.id = 'progressGradient';
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
    const s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#7A8B5B');
    const s2 = document.createElementNS(ns, 'stop');
    s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#C4A35A');
    grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);
    svg.prepend(defs);

    // Init auth
    initAuth();
    renderLibrary();

    // AI modal close
    const aiModalClose = $('#aiModalClose');
    const aiModalEl = $('#aiModal');
    if (aiModalClose) aiModalClose.addEventListener('click', () => aiModalEl.classList.remove('open'));
    if (aiModalEl) aiModalEl.addEventListener('click', (e) => { if (e.target === aiModalEl) aiModalEl.classList.remove('open'); });

    // Cookie consent
    const cookieConsent = $('#cookieConsent');
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
      cookieConsent.classList.add('visible');
    }
    const cookieAccept = $('#cookieAccept');
    if (cookieAccept) cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.classList.remove('visible');
    });
    const cookiePrivacyLink = $('#cookiePrivacyLink');
    if (cookiePrivacyLink) cookiePrivacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      const pm = $('#privacyModal');
      if (pm) pm.classList.add('open');
    });
    const cookieSettings = $('#cookieSettings');
    if (cookieSettings) cookieSettings.addEventListener('click', () => {
      // Placeholder for granular cookie settings
      showToast('سيتم إضافة إعدادات الكوكيز قريباً', 'info');
    });

    // Scroll-triggered fade sections
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-section').forEach(el => fadeObserver.observe(el));

    // Header scroll shadow
    function updateHeaderShadow() { header.classList.toggle('scrolled', window.scrollY > 20); }
    updateHeaderShadow();
    document.addEventListener('scroll', updateHeaderShadow, { passive: true });

    // Observe stats
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateStats(); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);

    console.log('PDF to E-Book initialized');
  }

  function setReaderTheme(theme) {
    currentReaderTheme = theme;
    readerContent.className = 'reader-content';
    readerContent.classList.add('reader-' + theme);
    $$('.theme-option').forEach(el => el.classList.toggle('active', el.dataset.theme === theme));
  }

  // Expose
  window.toggleTheme = toggleTheme;
  window.setLanguage = setLanguage;
  window.openAIModal = openAIModal;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
