import React, { useState, useEffect, useCallback, useRef } from 'react';
import WelcomeStep from './components/WelcomeStep';
import QuizCard from './components/QuizCard';
import AgeStep from './components/AgeStep';
import BodyMetricsStep from './components/BodyMetricsStep';
import CoachStep from './components/CoachStep';
import GoalStep from './components/GoalStep';
import AwarenessStep from './components/AwarenessStep';
import SummaryStep from './components/SummaryStep';
import AnalyzingStep from './components/AnalyzingStep';
import VSLStep from './components/VSLStep';
import CouponStep from './components/CouponStep';
import ResultStep from './components/ResultStep';
import BackRedirectStep from './components/BackRedirectStep';
import { QUIZ_STEPS, ASSETS } from './data/quizData';

import { 
  trackQuizStart, 
  trackQuizStep, 
  trackSummaryView, 
  trackAnalyzingStep, 
  trackCouponUnlocked, 
  trackOfferPage 
} from './utils/pixel';

import ScrollIndicator from './components/ScrollIndicator';

const STORAGE_ANSWERS_KEY = 'pgb_quiz_answers';
const STORAGE_SLUG_KEY = 'pgb_current_slug';

/**
 * Safe LocalStorage helpers
 */
const getSavedAnswers = () => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveAnswersToStorage = (answers) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

/**
 * Helper to compute the standard slug for any given step state
 */
export const getSlugForState = ({
  showWelcome,
  showSummary,
  isAnalyzing,
  isVSLStep,
  isCouponStep,
  isFinished,
  isBackRedirect,
  currentStepIndex
}) => {
  if (isBackRedirect) return 'oportunidad-exclusiva';
  if (showWelcome) return 'bienvenida';
  if (showSummary) return 'perfil-analizado';
  if (isAnalyzing) return 'analizando-ia';
  if (isVSLStep) return 'video-presentacion';
  if (isCouponStep) return 'beca-descuento';
  if (isFinished) return 'oferta-final';

  const step = QUIZ_STEPS[currentStepIndex];
  if (step) {
    return `paso-${currentStepIndex + 1}-${step.slug}`;
  }
  return `paso-${currentStepIndex + 1}`;
};

/**
 * Resolves full state flags and step index from a given URL slug or hash
 */
export const resolveStateFromSlug = (rawSlug) => {
  const clean = (rawSlug || '').replace(/^#\/?/, '').trim().toLowerCase();

  if (
    clean === 'oportunidad-exclusiva' || 
    clean === 'plan-especial' || 
    clean === 'descuento-especial' || 
    clean === 'retenida' || 
    clean === 'backredirect'
  ) {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: true
    };
  }

  if (!clean || clean === 'bienvenida' || clean === 'inicio' || clean === 'boas-vindas') {
    return {
      showWelcome: true,
      currentStepIndex: 0,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: false
    };
  }

  if (clean === 'perfil-analizado' || clean === 'resumen' || clean === 'diagnostico') {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: true,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: false
    };
  }

  if (clean === 'analizando-ia' || clean === 'analizando' || clean === 'ia') {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: false,
      isAnalyzing: true,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: false
    };
  }

  if (clean === 'video-presentacion' || clean === 'vsl' || clean === 'video') {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: true,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: false
    };
  }

  if (clean === 'beca-descuento' || clean === 'cupon' || clean === 'descuento' || clean === 'beca') {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: true,
      isFinished: false,
      isBackRedirect: false
    };
  }

  if (clean === 'oferta-final' || clean === 'resultado' || clean === 'oferta' || clean === 'checkout') {
    return {
      showWelcome: false,
      currentStepIndex: QUIZ_STEPS.length - 1,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: true,
      isBackRedirect: false
    };
  }

  // Check direct matches in QUIZ_STEPS (by full slug, short paso-X, or step.slug)
  const stepIdx = QUIZ_STEPS.findIndex((step, idx) => {
    const fullSlug = `paso-${idx + 1}-${step.slug}`.toLowerCase();
    const shortStep = `paso-${idx + 1}`.toLowerCase();
    return clean === fullSlug || clean === shortStep || clean === step.slug.toLowerCase();
  });

  if (stepIdx !== -1) {
    return {
      showWelcome: false,
      currentStepIndex: stepIdx,
      showSummary: false,
      isAnalyzing: false,
      isVSLStep: false,
      isCouponStep: false,
      isFinished: false,
      isBackRedirect: false
    };
  }

  // Fallback regex match for "paso-X"
  const match = clean.match(/^paso-(\d+)/);
  if (match) {
    const num = Number.parseInt(match[1], 10) - 1;
    if (num >= 0 && num < QUIZ_STEPS.length) {
      return {
        showWelcome: false,
        currentStepIndex: num,
        showSummary: false,
        isAnalyzing: false,
        isVSLStep: false,
        isCouponStep: false,
        isFinished: false,
        isBackRedirect: false
      };
    }
  }

  // Default fallback to welcome
  return {
    showWelcome: true,
    currentStepIndex: 0,
    showSummary: false,
    isAnalyzing: false,
    isVSLStep: false,
    isCouponStep: false,
    isFinished: false,
    isBackRedirect: false
  };
};

export default function App() {
  const initialHash = typeof window !== 'undefined' ? window.location.hash : '';
  const initialResolved = resolveStateFromSlug(initialHash || 'bienvenida');

  const [showWelcome, setShowWelcome] = useState(initialResolved.showWelcome);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialResolved.currentStepIndex);
  const [answers, setAnswers] = useState(getSavedAnswers);
  const [showSummary, setShowSummary] = useState(initialResolved.showSummary);
  const [isAnalyzing, setIsAnalyzing] = useState(initialResolved.isAnalyzing);
  const [isVSLStep, setIsVSLStep] = useState(initialResolved.isVSLStep);
  const [isCouponStep, setIsCouponStep] = useState(initialResolved.isCouponStep);
  const [isFinished, setIsFinished] = useState(initialResolved.isFinished);
  const [isBackRedirect, setIsBackRedirect] = useState(initialResolved.isBackRedirect);

  const totalSteps = QUIZ_STEPS.length;
  const currentStepData = QUIZ_STEPS[currentStepIndex] || QUIZ_STEPS[0];
  const isNavigating = useRef(false);

  // INSTANT IMAGE & GIF PRELOADER IN BROWSER MEMORY
  useEffect(() => {
    const urlsToPreload = [
      ASSETS.logo,
      ASSETS.vslCover,
      ASSETS.gifs?.sales1,
      ASSETS.gifs?.fit1,
      ASSETS.gifs?.homeFit,
      ASSETS.coach?.main,
      ASSETS.coach?.alt,
      ...Object.values(ASSETS.ages || {}),
      ...(ASSETS.results || [])
    ];
    urlsToPreload.forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  // COMPUTED CURRENT SLUG
  const currentSlug = getSlugForState({
    showWelcome,
    showSummary,
    isAnalyzing,
    isVSLStep,
    isCouponStep,
    isFinished,
    isBackRedirect,
    currentStepIndex
  });

  const getStepNumber = useCallback(() => {
    if (isBackRedirect) return totalSteps + 4;
    if (showWelcome) return 0;
    if (isFinished) return totalSteps + 3;
    if (isCouponStep) return totalSteps + 2;
    if (isVSLStep) return totalSteps + 1;
    if (isAnalyzing || showSummary) return totalSteps;
    return currentStepIndex + 1;
  }, [showWelcome, isFinished, isCouponStep, isVSLStep, isAnalyzing, showSummary, isBackRedirect, currentStepIndex, totalSteps]);

  // SAVE ANSWERS TO LOCALSTORAGE ON EVERY UPDATE
  useEffect(() => {
    saveAnswersToStorage(answers);
  }, [answers]);

  // AUTOMATIC URL SLUG SYNCHRONIZATION
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const newHash = `#${currentSlug}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
    try {
      localStorage.setItem(STORAGE_SLUG_KEY, currentSlug);
    } catch {
      // Ignore
    }

    // Fire Custom Pixel Event
    window.dispatchEvent(new CustomEvent('quiz_step_change', {
      detail: { 
        slug: currentSlug, 
        stepNumber: getStepNumber(),
        answers 
      }
    }));

    if (isFinished) {
      trackOfferPage();
    }

    // Scroll to top on step transition
    window.scrollTo({ top: 0, behavior: 'instant' });

    let hasInteracted = false;
    let cancelCurrentAnim = null;

    const handleUserInteraction = () => {
      hasInteracted = true;
      if (cancelCurrentAnim) {
        cancelCurrentAnim();
        cancelCurrentAnim = null;
      }
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    // Custom ultra-smooth motion animator using requestAnimationFrame and easeInOutCubic
    const smoothMotionScrollTo = (targetY, duration = 1400) => {
      if (typeof window === 'undefined' || hasInteracted) return;
      
      const startY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const finalY = Math.min(Math.max(0, targetY), maxScroll);
      const distance = finalY - startY;

      if (Math.abs(distance) < 8) return;

      let startTime = null;
      let animId = null;
      let isCancelled = false;

      // Soft cubic easing for a silky motion descent
      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const step = (timestamp) => {
        if (isCancelled || hasInteracted) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };

      animId = requestAnimationFrame(step);

      cancelCurrentAnim = () => {
        isCancelled = true;
        if (animId) cancelAnimationFrame(animId);
      };
    };

    // PHASE 1: SILKY SUBTLE DESCENT (80px over 1200ms) AT 1.2s
    const hintTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && !hasInteracted) {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        if (scrollHeight > clientHeight + 120 && window.scrollY <= 25) {
          smoothMotionScrollTo(window.scrollY + 90, 1300);
        }
      }
    }, 1200);

    // PHASE 2: PROGRESSIVE GENTLE GLIDE TO ACTION BUTTON AT 3.2s IF NO USER ACTION
    const guideTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && !hasInteracted) {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        if (scrollHeight > clientHeight + 140 && window.scrollY <= 160) {
          const targetAction = document.querySelector('button[type="submit"]') ||
                               document.querySelector('a[href*="hotmart"]') ||
                               document.querySelector('a[href*="centerpag"]') ||
                               document.querySelector('.quiz-card button:last-of-type') ||
                               document.querySelector('button.group');

          if (targetAction) {
            const rect = targetAction.getBoundingClientRect();
            const targetPos = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);
            smoothMotionScrollTo(targetPos, 1800);
          } else {
            smoothMotionScrollTo(window.scrollY + 340, 1600);
          }
        }
      }
    }, 3200);

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(guideTimer);
      if (cancelCurrentAnim) cancelCurrentAnim();
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [currentSlug, getStepNumber, isFinished, answers]);

  // BACKREDIRECT TRAP & RETENTION LOGIC
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // When on conversion-critical stages, push a trap history state to catch back button
    if (isVSLStep || isCouponStep || isFinished || showSummary) {
      window.history.pushState({ pgb_trap: true }, '', window.location.href);

      const handlePopState = () => {
        // If user presses browser back button on conversion pages, intercept and show the high value retention page
        if (!isBackRedirect) {
          navigateToSlug('oportunidad-exclusiva');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isVSLStep, isCouponStep, isFinished, showSummary, isBackRedirect]);

  // HANDLE BROWSER BACK/FORWARD AND MANUAL HASH CHANGES
  useEffect(() => {
    const handleHashChange = () => {
      const targetHash = window.location.hash;
      const resolved = resolveStateFromSlug(targetHash);
      setShowWelcome(resolved.showWelcome);
      setCurrentStepIndex(resolved.currentStepIndex);
      setShowSummary(resolved.showSummary);
      setIsAnalyzing(resolved.isAnalyzing);
      setIsVSLStep(resolved.isVSLStep);
      setIsCouponStep(resolved.isCouponStep);
      setIsFinished(resolved.isFinished);
      setIsBackRedirect(resolved.isBackRedirect);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateToSlug = (targetSlug) => {
    if (typeof window !== 'undefined') {
      const newHash = `#${targetSlug}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
    }
    const resolved = resolveStateFromSlug(targetSlug);
    setShowWelcome(resolved.showWelcome);
    setCurrentStepIndex(resolved.currentStepIndex);
    setShowSummary(resolved.showSummary);
    setIsAnalyzing(resolved.isAnalyzing);
    setIsVSLStep(resolved.isVSLStep);
    setIsCouponStep(resolved.isCouponStep);
    setIsFinished(resolved.isFinished);
    setIsBackRedirect(resolved.isBackRedirect);
  };

  const handleStartQuiz = () => {
    trackQuizStart();
    // Reset answers so new quiz runs clean without pre-selected answers from previous sessions
    setAnswers({});
    try {
      localStorage.removeItem(STORAGE_ANSWERS_KEY);
    } catch {
      // Ignore
    }
    const nextSlug = `paso-1-${QUIZ_STEPS[0].slug}`;
    navigateToSlug(nextSlug);
  };

  const handleSelectOption = (value) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    const stepData = currentStepData;
    const newAnswers = { ...answers, [stepData.id]: value };
    setAnswers(newAnswers);

    trackQuizStep(currentStepIndex + 1, totalSteps, stepData, value);

    if (currentStepIndex >= totalSteps - 1) {
      trackSummaryView(newAnswers);
      setTimeout(() => {
        navigateToSlug('perfil-analizado');
        isNavigating.current = false;
      }, 100);
    } else {
      setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        const nextStep = QUIZ_STEPS[nextIdx];
        const nextSlug = `paso-${nextIdx + 1}-${nextStep.slug}`;
        navigateToSlug(nextSlug);
        isNavigating.current = false;
      }, 100);
    }
  };

  const handlePrevStep = () => {
    if (isBackRedirect) {
      navigateToSlug('oferta-final');
    } else if (isFinished) {
      navigateToSlug('beca-descuento');
    } else if (isCouponStep) {
      navigateToSlug('video-presentacion');
    } else if (isVSLStep) {
      navigateToSlug('perfil-analizado');
    } else if (isAnalyzing) {
      navigateToSlug('perfil-analizado');
    } else if (showSummary) {
      const lastIdx = totalSteps - 1;
      const lastStep = QUIZ_STEPS[lastIdx];
      navigateToSlug(`paso-${lastIdx + 1}-${lastStep.slug}`);
    } else if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const prevStep = QUIZ_STEPS[prevIdx];
      navigateToSlug(`paso-${prevIdx + 1}-${prevStep.slug}`);
    } else {
      navigateToSlug('bienvenida');
    }
  };

  const handleSummaryContinue = () => {
    trackAnalyzingStep();
    navigateToSlug('analizando-ia');
  };

  const handleAnalyzingComplete = () => {
    navigateToSlug('video-presentacion');
  };

  const handleVSLContinue = () => {
    trackCouponUnlocked();
    navigateToSlug('beca-descuento');
  };

  const handleClaimCoupon = () => {
    trackOfferPage();
    navigateToSlug('oferta-final');
  };

  const renderCurrentStep = () => {
    if (isBackRedirect) {
      return (
        <BackRedirectStep
          onBackToQuiz={() => navigateToSlug('oferta-final')}
        />
      );
    }
    if (showWelcome) {
      return <WelcomeStep onStart={handleStartQuiz} />;
    }
    if (showSummary) {
      return <SummaryStep userAnswers={answers} onContinue={handleSummaryContinue} onPrevStep={handlePrevStep} />;
    }
    if (isAnalyzing) {
      return <AnalyzingStep onComplete={handleAnalyzingComplete} />;
    }
    if (isVSLStep) {
      return <VSLStep onContinue={handleVSLContinue} />;
    }
    if (isCouponStep) {
      return <CouponStep onClaimCoupon={handleClaimCoupon} />;
    }
    if (isFinished) {
      return <ResultStep userAnswers={answers} />;
    }
    if (currentStepData.type === 'age') {
      return (
        <AgeStep
          stepData={currentStepData}
          onSelectOption={handleSelectOption}
          onPrevStep={handlePrevStep}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />
      );
    }
    if (currentStepData.type === 'body-metrics') {
      return (
        <BodyMetricsStep
          stepData={currentStepData}
          onNext={(metrics) => handleSelectOption(metrics)}
          onPrevStep={handlePrevStep}
          initialMetrics={answers[currentStepData.id]}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />
      );
    }
    if (currentStepData.type === 'coach') {
      return (
        <CoachStep
          stepData={currentStepData}
          onNext={handleSelectOption}
          onPrevStep={handlePrevStep}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />
      );
    }
    if (currentStepData.type === 'awareness') {
      return (
        <AwarenessStep
          stepData={currentStepData}
          onSelectOption={handleSelectOption}
          onPrevStep={handlePrevStep}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />
      );
    }
    if (currentStepData.type === 'goal') {
      return (
        <GoalStep
          stepData={currentStepData}
          onSelectOption={handleSelectOption}
          onPrevStep={handlePrevStep}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />
      );
    }
    return (
      <QuizCard
        stepData={currentStepData}
        onSelectOption={handleSelectOption}
        onPrevStep={handlePrevStep}
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] font-body text-[#2B0B2E] antialiased selection:bg-[#FF2A85] selection:text-white">
      {renderCurrentStep()}
      <ScrollIndicator key={currentSlug} />
    </div>
  );
}
