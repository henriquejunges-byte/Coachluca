/**
 * Meta (Facebook) Pixel Ultra-Advanced & Intelligent Tracking Helper
 * Pixel ID: 1663158028859442
 * Features:
 * - Persistent UTM & Query parameter preservation across sessions and steps
 * - Automatic Facebook Browser ID (_fbp) & Click ID (_fbc / fbclid) forwarding to Checkout
 * - Deterministic eventID generation for Meta CAPI (Conversions API) deduplication
 * - Deep funnel step milestones, engagement & video retention tracking
 */

import { CHECKOUT_URL, DOWNSELL_CHECKOUT_URL } from '../data/quizData';

export const META_PIXEL_ID = '1663158028859442';

const UTM_STORAGE_KEY = 'pgb_persisted_utms';


/**
 * Capture and persist URL query parameters (UTMs, fbclid, src, etc.)
 */
export const captureAndPersistUTMs = () => {
  if (typeof window === 'undefined') return {};

  try {
    const currentParams = new URLSearchParams(window.location.search);
    const saved = localStorage.getItem(UTM_STORAGE_KEY);
    const persisted = saved ? JSON.parse(saved) : {};

    const utmKeys = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'src', 'sck', 'xcod', 'fbclid', 'gclid', 'ttclid'
    ];

    let hasNew = false;
    utmKeys.forEach((key) => {
      const val = currentParams.get(key);
      if (val) {
        persisted[key] = val;
        hasNew = true;
      }
    });

    // Also capture any custom URL query params
    currentParams.forEach((val, key) => {
      if (!persisted[key]) {
        persisted[key] = val;
        hasNew = true;
      }
    });

    if (hasNew || !saved) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(persisted));
    }

    return persisted;
  } catch {
    return {};
  }
};

/**
 * Get cookie by name helper (for _fbp, _fbc)
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift() || '';
  return '';
};

/**
 * Generate unique/deterministic Event ID for CAPI deduplication
 */
export const generateEventID = (eventName, step = '') => {
  const timestamp = Date.now();
  let randomPart = '';
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    randomPart = array[0].toString(36);
  } else {
    randomPart = (Math.floor(Date.now() + 1000)).toString(36);
  }
  const prefix = step ? `${eventName}_${step}_` : `${eventName}_`;
  return `${prefix}${timestamp}_${randomPart}`;
};

/**
 * Dispatch Meta Pixel events safely with Advanced Parameters & EventID
 */
export const trackMetaEvent = (eventName, params = {}, isCustom = false, customEventID = null) => {
  if (typeof window === 'undefined') return null;

  const eventID = customEventID || generateEventID(eventName);

  try {
    if (typeof window.fbq === 'function') {
      const payload = {
        ...params,
        pixel_id: META_PIXEL_ID,
        timestamp: new Date().toISOString()
      };

      const options = { eventID };

      if (isCustom) {
        window.fbq('trackCustom', eventName, payload, options);
      } else {
        window.fbq('track', eventName, payload, options);
      }
    }
  } catch (err) {
    console.warn('[Meta Pixel Tracking Warning]:', err);
  }

  return eventID;
};

/**
 * Dynamic PageView Trigger for Hash Changes and Step Navigation
 */
export const trackPageView = (pageSlug = '', extraData = {}) => {
  captureAndPersistUTMs();
  return trackMetaEvent('PageView', {
    page_slug: pageSlug,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    ...extraData
  });
};

/**
 * Event 1: Start Quiz (Bienvenida -> Paso 1)
 */
export const trackQuizStart = () => {
  const eventID = generateEventID('Lead', 'start');

  trackMetaEvent('QuizStart', {
    content_name: 'Protocolo Glúteos Brasileños - Evaluación',
    funnel_stage: 'quiz_start'
  }, true, eventID);

  trackMetaEvent('Lead', {
    content_name: 'Inicio del Quiz PGB',
    content_category: 'Quiz Funnel',
    status: 'started'
  }, false, eventID);
};

/**
 * Event 2: Step Answered / Step View with Progress Milestones
 */
export const trackQuizStep = (stepNumber, totalSteps, stepData, selectedValue) => {
  const percentage = Math.round((stepNumber / totalSteps) * 100);
  const stepSlug = stepData?.slug || `paso-${stepNumber}`;

  // Custom step specific event
  trackMetaEvent(`QuizStep_${stepNumber}`, {
    step_number: stepNumber,
    step_slug: stepSlug,
    question_title: stepData?.title || '',
    selected_value: selectedValue || '',
    progress_percentage: `${percentage}%`
  }, true);

  trackMetaEvent('QuizStepView', {
    step_number: stepNumber,
    total_steps: totalSteps,
    step_slug: stepSlug,
    progress_percentage: `${percentage}%`
  }, true);

  // Progressive Milestone tracking for Meta Pixel Algorithm Optimization
  if (stepNumber === 1) {
    trackMetaEvent('ViewContent', {
      content_name: 'Primera Pregunta - Protocolo PGB',
      content_category: 'Quiz Step',
      content_type: 'product'
    });
  } else if (stepNumber === 4) {
    trackMetaEvent('QuizProgress25', {
      step_number: stepNumber,
      progress: '25%'
    }, true);
  } else if (stepNumber === 7) {
    trackMetaEvent('QuizProgress50', {
      step_number: stepNumber,
      progress: '50%'
    }, true);
  } else if (stepNumber === 10) {
    trackMetaEvent('QuizProgress75', {
      step_number: stepNumber,
      progress: '75%'
    }, true);
  } else if (stepData?.type === 'coach') {
    trackMetaEvent('ViewContent', {
      content_name: 'Presentación Coach Luca',
      content_category: 'Coach Authority',
      content_type: 'product'
    });
  }
};

/**
 * Event 3: Summary Step (Perfil Analizado)
 */
export const trackSummaryView = (userAnswers = {}) => {
  const eventID = generateEventID('CustomizeProduct', 'summary');

  trackMetaEvent('CustomizeProduct', {
    content_name: 'Plan Personalizado Glúteos 28D',
    user_answers_count: Object.keys(userAnswers).length,
    value: 19.90,
    currency: 'USD'
  }, false, eventID);

  trackMetaEvent('QuizCompleted', {
    status: 'completed',
    answers_count: Object.keys(userAnswers).length,
    timestamp: new Date().toISOString()
  }, true, eventID);
};

/**
 * Event 4: Analyzing Step (IA Processing)
 */
export const trackAnalyzingStep = () => {
  trackMetaEvent('Search', {
    search_string: 'Análisis Biomecánico IA Glúteos',
    content_category: 'IA Diagnostics'
  });

  trackMetaEvent('DiagnosingProfile', {
    status: 'analyzing_metrics'
  }, true);
};

/**
 * Event 5: Coupon Unlocked (Raspa y Gana)
 */
export const trackCouponUnlocked = () => {
  trackMetaEvent('CouponUnlocked', {
    coupon_code: 'BECA_VIP',
    discount_percentage: '80%',
    status: 'unlocked',
    currency: 'USD'
  }, true);

  trackMetaEvent('ViewContent', {
    content_name: 'Beca y Cupón Misterioso Desbloqueado',
    content_category: 'Promotion Reward',
    content_type: 'product'
  });
};

/**
 * Event 6: Offer / Result Page Load (AddToCart & InitiateCheckout)
 */
export const trackOfferPage = () => {
  const eventID = generateEventID('InitiateCheckout', 'offer');

  trackMetaEvent('AddToCart', {
    content_name: 'Protocolo Glúteos Brasileños by Coach Luca',
    content_category: 'Programa de Entrenamiento y Nutrición',
    content_type: 'product',
    content_ids: ['pgb_990'],
    value: 9.90,
    currency: 'USD'
  }, false, eventID);

  trackMetaEvent('InitiateCheckout', {
    content_name: 'Protocolo Glúteos Brasileños by Coach Luca',
    content_category: 'Programa de Entrenamiento y Nutrición',
    content_type: 'product',
    content_ids: ['pgb_990'],
    value: 9.90,
    currency: 'USD',
    num_items: 1
  }, false, eventID);

  trackMetaEvent('OfferPageView', {
    offer_price: 9.90,
    original_price: 97.00,
    discount_percentage: '90%',
    pixel_id: META_PIXEL_ID
  }, true, eventID);
};

/**
 * Builds the complete destination checkout URL with all persisted UTMs, fbclid, _fbp and _fbc
 */
export const getFinalCheckoutUrl = () => {
  if (typeof window === 'undefined') return CHECKOUT_URL;

  const persisted = captureAndPersistUTMs();
  const searchParams = new URLSearchParams(window.location.search);

  // Merge persisted params
  Object.entries(persisted).forEach(([key, val]) => {
    if (val && !searchParams.has(key)) {
      searchParams.set(key, val);
    }
  });

  // Attach Meta Facebook browser/click tracking cookies if available
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  if (fbp && !searchParams.has('fbp')) searchParams.set('fbp', fbp);
  if (fbc && !searchParams.has('fbc')) searchParams.set('fbc', fbc);

  const queryString = searchParams.toString();
  if (!queryString) return CHECKOUT_URL;

  // Clean trailing ? or & from base checkout url
  let cleanBaseUrl = CHECKOUT_URL;
  while (cleanBaseUrl.endsWith('?') || cleanBaseUrl.endsWith('&')) {
    cleanBaseUrl = cleanBaseUrl.slice(0, -1);
  }
  const separator = cleanBaseUrl.includes('?') ? '&' : '?';
  return `${cleanBaseUrl}${separator}${queryString}`;
};

/**
 * Builds the complete downsell checkout URL ($5.90) with all persisted UTMs
 */
export const getFinalDownsellCheckoutUrl = () => {
  const baseUrl = DOWNSELL_CHECKOUT_URL || 'https://pay.hotmart.com/V107941841D?off=j4kwpqwa';
  if (typeof window === 'undefined') return baseUrl;

  const persisted = captureAndPersistUTMs();
  const searchParams = new URLSearchParams(window.location.search);

  Object.entries(persisted).forEach(([key, val]) => {
    if (val && !searchParams.has(key)) {
      searchParams.set(key, val);
    }
  });

  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  if (fbp && !searchParams.has('fbp')) searchParams.set('fbp', fbp);
  if (fbc && !searchParams.has('fbc')) searchParams.set('fbc', fbc);

  const queryString = searchParams.toString();
  if (!queryString) return baseUrl;

  let cleanBaseUrl = baseUrl;
  while (cleanBaseUrl.endsWith('?') || cleanBaseUrl.endsWith('&')) {
    cleanBaseUrl = cleanBaseUrl.slice(0, -1);
  }
  const separator = cleanBaseUrl.includes('?') ? '&' : '?';
  return `${cleanBaseUrl}${separator}${queryString}`;
};

/**
 * Event 7: Click Checkout Button (AddPaymentInfo & Outbound Conversion Click)
 */
export const trackCheckoutClick = () => {
  const destinationUrl = getFinalCheckoutUrl();
  const eventID = generateEventID('AddPaymentInfo', 'cta_click');

  trackMetaEvent('AddPaymentInfo', {
    content_name: 'Protocolo Glúteos Brasileños',
    content_category: 'Checkout Outbound',
    value: 9.90,
    currency: 'USD'
  }, false, eventID);

  trackMetaEvent('ClickCheckoutButton', {
    checkout_url: destinationUrl,
    value: 9.90,
    currency: 'USD',
    pixel_id: META_PIXEL_ID,
    timestamp: new Date().toISOString()
  }, true, eventID);

  if (typeof window !== 'undefined') {
    window.location.href = destinationUrl;
  }
};

/**
 * Event 7B: Click Downsell Checkout Button ($5.90 Special Emergency Subsidio)
 */
export const trackDownsellCheckoutClick = () => {
  const destinationUrl = getFinalDownsellCheckoutUrl();
  const eventID = generateEventID('AddPaymentInfo', 'downsell_click');

  trackMetaEvent('AddPaymentInfo', {
    content_name: 'Protocolo Glúteos Brasileños - Subsidio 5.90',
    content_category: 'Downsell Checkout Outbound',
    value: 5.90,
    currency: 'USD'
  }, false, eventID);

  trackMetaEvent('ClickCheckoutButton', {
    checkout_url: destinationUrl,
    value: 5.90,
    currency: 'USD',
    offer_type: 'emergency_subsidio',
    pixel_id: META_PIXEL_ID,
    timestamp: new Date().toISOString()
  }, true, eventID);

  if (typeof window !== 'undefined') {
    window.location.href = destinationUrl;
  }
};


/**
 * Event 8: VSL Video Page View
 */
export const trackVSLView = () => {
  trackMetaEvent('VSLView', {
    content_name: 'Protocolo Glúteos Brasileños - Video VSL',
    content_category: 'VSL Stage'
  }, true);

  trackMetaEvent('ViewContent', {
    content_name: 'Presentación Oficial Video - VSL Glúteos',
    content_type: 'video'
  });
};

/**
 * Event 9: VSL Video Play Started
 */
export const trackVSLPlay = () => {
  trackMetaEvent('VSLPlay', {
    content_name: 'VSL Video Started',
    action: 'play'
  }, true);
};

/**
 * Event 10: VSL Video Retention Milestones (50%, 80%, 100%)
 */
export const trackVSLProgress = (percent) => {
  trackMetaEvent(`VSLProgress_${percent}`, {
    milestone: `${percent}%`,
    content_name: 'VSL Retention Milestone'
  }, true);
};

/**
 * Event 11: VSL Video Completed or Proceed Clicked
 */
export const trackVSLComplete = () => {
  trackMetaEvent('VSLCompleted', {
    content_name: 'VSL Video Concluded / Next Step',
    action: 'proceed_to_coupon'
  }, true);
};

/**
 * Event 12: BackRedirect Retention Page View
 */
export const trackBackredirectView = () => {
  trackMetaEvent('BackRedirectView', {
    content_name: 'BackRedirect Retention Page',
    content_category: 'Retention / Value Showcase',
    action: 'back_intercepted'
  }, true);
};

