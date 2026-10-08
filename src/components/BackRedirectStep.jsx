import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Zap, 
  Award, 
  X,
  Tag
} from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import { CHECKOUT_URL, DOWNSELL_CHECKOUT_URL, BEFORE_AFTER_CASES } from '../data/quizData';
import { trackCheckoutClick, trackDownsellCheckoutClick, trackBackredirectView, trackMetaEvent } from '../utils/pixel';

export default function BackRedirectStep({ onBackToQuiz }) {
  const [timeLeft, setTimeLeft] = useState(588); // 9 min 48 sec
  const [showDownsellModal, setShowDownsellModal] = useState(false);

  useEffect(() => {
    trackBackredirectView();
    window.scrollTo({ top: 0, behavior: 'instant' });

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // 1. EXIT-INTENT TRIGGER (DESKTOP)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 15) {
        setShowDownsellModal(true);
        trackMetaEvent('Downsell_ExitIntent_Triggered', { offer: 'subsidio_5.90' }, true);
      }
    };

    // 2. BACK-TRAP TRIGGER (MOBILE & BROWSER HISTORY)
    window.history.pushState({ downsell_trap: true }, '', window.location.href);
    const handlePopState = () => {
      setShowDownsellModal(true);
      trackMetaEvent('Downsell_Popstate_Triggered', { offer: 'subsidio_5.90' }, true);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckout = (e, isDownsell = false) => {
    e.preventDefault();
    if (isDownsell) {
      trackDownsellCheckoutClick();
    } else {
      trackCheckoutClick();
    }
  };

  const handleOpenDownsell = (e) => {
    e.preventDefault();
    setShowDownsellModal(true);
    trackMetaEvent('Downsell_Manual_Opened', { offer: 'subsidio_5.90' }, true);
  };


  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-5 px-3.5 sm:px-6 flex flex-col items-center font-body text-[#2B0B2E]">
      
      <div className="w-full max-w-xl mx-auto space-y-4">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* TOP FLOATING URGENCY BANNER */}
        <div className="bg-gradient-to-r from-[#2B0B2E] via-[#FF2A85] to-[#FF007F] text-white rounded-2xl p-3 px-4 shadow-lg flex items-center justify-between gap-2 border border-white/20 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide font-heading">
              🚨 Beca del 80% Reservada Temporalmente
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full font-mono text-xs font-black text-[#FFE600]">
            <Clock className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* MAIN VALUE HERO CARD */}
        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-xl border border-[#F0D2E4] space-y-5 text-center quiz-card animate-pop text-[#2B0B2E]">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[2px_2px_0px_#FF2A85] font-heading">
            <Gift className="w-3.5 h-3.5 text-[#19041C]" />
            <span>Oportunidad Única de Retención</span>
          </div>

          {/* Strong Headline */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B0B2E] leading-tight font-heading">
              ¡Espera! No Te Vayas Sin Ver Todo el Valor de Tu Plan 🍑
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5469] font-medium leading-relaxed max-w-lg mx-auto">
              Antes de salir, mira exactamente todo lo que recibirás para <strong className="text-[#FF2A85]">levantar, redondear y tonificar tus glúteos en 28 días</strong> sin pesas ni cirugías:
            </p>
          </div>

          {/* WHAT IS INCLUDED (VALUE STACK) */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF2A85]" />
                <span>Todo lo que incluye tu acceso VIP hoy:</span>
              </span>
              <span className="text-[11px] font-black text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#10B981]/30">
                100% Desbloqueado
              </span>
            </div>

            {/* Value Item 1 */}
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FF2A85] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading">
                    Protocolo Glúteos Brasileños 28D (PGB)
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$97.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  El paso a paso de 4 fases con estímulos neuromusculares de 8 a 10 min/día desde casa.
                </p>
              </div>
            </div>

            {/* Value Item 2 */}
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#19041C] flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                2
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading">
                    Guía Nutricional Anti-Flacidez y Firmeza
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$47.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  Combinaciones de alimentos que nutren las fibras glúteas sin pasar hambre ni dietas raras.
                </p>
              </div>
            </div>

            {/* Value Item 3 */}
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                3
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading">
                    App Web Interactiva y Cronograma Diario
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$37.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  Acceso directo desde tu móvil en cualquier momento, con vídeos en HD guiados por Coach Luca.
                </p>
              </div>
            </div>

            {/* Value Item 4 - BONUS 1 */}
            <div className="bg-[#FFF5F9] p-3.5 rounded-2xl border-2 border-[#FF2A85] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#FFB800] text-[#19041C] flex items-center justify-center font-black text-xs shrink-0 shadow-xs uppercase font-heading">
                GRATIS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading flex items-center gap-1">
                    <span>🎁 BÔNUS: SOS Celulite & Efeito Push-Up 14D</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$29.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  Técnicas de drenaje linfático casero para alisar la piel y eliminar hoyitos en tiempo récord.
                </p>
              </div>
            </div>

            {/* Value Item 5 - BONUS 2 */}
            <div className="bg-[#FFF5F9] p-3.5 rounded-2xl border-2 border-[#FF2A85] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE600] to-[#FFB800] text-[#19041C] flex items-center justify-center font-black text-xs shrink-0 shadow-xs uppercase font-heading">
                GRATIS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading flex items-center gap-1">
                    <span>🎁 BÔNUS: Guía de Tés Metabólicos Quema-Grasa</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$19.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  Infusiones naturales para desinflamar el abdomen y potenciar la definición de tu silueta.
                </p>
              </div>
            </div>

            {/* Value Item 6 - SUPPORT */}
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center font-black text-lg shrink-0 shadow-xs border border-[#FFE600]/40">
                ★
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2B0B2E] font-heading">
                    Soporte & Comunidad VIP de Alumnas
                  </h3>
                  <span className="text-[11px] font-bold text-[#91798E] line-through shrink-0">$67.00</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6B5469] font-medium mt-0.5">
                  Acompañamiento motivacional continuo para no rendirte nunca hasta ver tu transformación.
                </p>
              </div>
            </div>

          </div>

          {/* VALUE ANCHOR COMPARISON */}
          <div className="bg-[#FAF2F7] text-[#2B0B2E] rounded-[24px] p-4.5 sm:p-6 text-left space-y-3.5 shadow-xs border border-[#F0DCEB]">
            <div className="flex items-center justify-between border-b border-[#F0DCEB] pb-2.5">
              <span className="text-xs font-black tracking-wider uppercase text-[#FF2A85] font-heading">
                Comparativa de Inversión:
              </span>
              <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full font-bold border border-[#F0DCEB]">
                Valor Real
              </span>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center text-[#6B5469]">
                <span>• Gimnasio tradicional (6 meses):</span>
                <span className="line-through">$180.00</span>
              </div>
              <div className="flex justify-between items-center text-[#6B5469]">
                <span>• Entrenador personal mensual:</span>
                <span className="line-through">$150.00/mes</span>
              </div>
              <div className="flex justify-between items-center text-[#6B5469]">
                <span>• Procedimientos y masajes estéticos:</span>
                <span className="line-through">$300.00+</span>
              </div>
              <div className="flex justify-between items-center text-[#2B0B2E] pt-1 border-t border-[#F0DCEB] font-bold">
                <span>Valor Total de todo el paquete:</span>
                <span className="text-sm line-through text-red-500">$296.00</span>
              </div>
            </div>

            {/* Final Discount Price Box */}
            <div className="bg-white text-[#2B0B2E] border-2 border-[#FF2A85] rounded-2xl p-4 text-center space-y-1 shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-black uppercase text-[#FF2A85] tracking-wider block font-heading">
                🎉 TU PRECIO CON BECA DEL 80% HOY:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#059669] font-heading tracking-tight">
                  $9.90
                </span>
                <span className="text-xs text-[#6B5469] font-bold">
                  (Pago Único • Sin Mensualidades)
                </span>
              </div>
              <p className="text-[10px] text-[#91798E] font-medium">
                Acceso Vitalício + Todas las Actualizaciones Futuras Incluidas
              </p>
            </div>
          </div>

          {/* PRIMARY CTA BUTTON ($9.90) */}
          <div className="space-y-2.5 pt-1">
            <a
              href={CHECKOUT_URL}
              onClick={(e) => handleCheckout(e, false)}
              className="w-full py-4.5 sm:py-5 px-6 rounded-[22px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#10B981] hover:brightness-110 text-white font-black text-base sm:text-lg shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer font-heading uppercase tracking-wide group animate-pulse border-none text-center no-underline"
            >
              <Zap className="w-5 h-5 text-[#FFE600] fill-[#FFE600] shrink-0" />
              <span>👉 SÍ, QUIERO ACTIVAR MI BECA POR $9.90</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>

            {/* Guarantee Callout */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#059669] bg-[#ECFDF5] border border-[#10B981]/40 py-2 px-3 rounded-xl font-black font-heading">
              <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
              <span>Garantía Incondicional de 30 Días • Riesgo Cero</span>
            </div>
          </div>

          {/* REAL RESULTS SHOWCASE */}
          <div className="space-y-3 pt-3 text-left border-t border-[#F0DCEB]">
            <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wider font-heading block">
              Resultados de alumnas que empezaron con el mismo plan:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {(BEFORE_AFTER_CASES || []).slice(0, 2).map((item) => (
                <div key={`case-${item.title}`} className="bg-[#FAF2F7] rounded-2xl p-2.5 border border-[#F0DCEB] space-y-1.5 text-center shadow-2xs">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-[#2B0B2E] block font-heading truncate">{item.title}</span>
                    <span className="text-[10px] font-extrabold text-[#059669] block">{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 30 DAYS GUARANTEE CARD */}
          <div className="bg-[#ECFDF5] rounded-2xl p-4 border border-[#10B981]/40 text-left flex items-start gap-3 shadow-2xs">
            <Award className="w-10 h-10 text-[#059669] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-[#065F46] font-heading">
                Garantía Blindada de Satisfacción Total (30 Días)
              </h4>
              <p className="text-[11px] text-[#065F46] leading-relaxed">
                Prueba el método por 30 días enteros. Si por cualquier motivo sientes que no es para ti o no ves tus glúteos más levantados y firmes, solo envía un mensaje y te reembolsamos el 100% de tu dinero inmediatamente.
              </p>
            </div>
          </div>

          {/* SENSITIVE DECLINE TRIGGER (LEADS TO HALF-PRICE OFFER) */}
          <div className="pt-2 border-t border-[#F0DCEB]">
            <button
              type="button"
              onClick={handleOpenDownsell}
              className="text-xs font-bold text-[#91798E] hover:text-[#FF2A85] underline transition-colors cursor-pointer block mx-auto py-1"
            >
              ¿El valor de $9.90 todavía es un problema? Toca aquí para ver una opción especial
            </button>
          </div>

          {/* Back to Quiz / Summary Link */}
          {onBackToQuiz && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={onBackToQuiz}
                className="text-[11px] font-medium text-[#91798E] hover:text-[#2B0B2E] transition-colors cursor-pointer"
              >
                Volver a la presentación del vídeo
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 50% OFF HALF-PRICE DOWNSELL MODAL ($5.90) WHEN USER TRIES TO LEAVE */}
      {/* ========================================================================= */}
      {showDownsellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-[28px] p-5 sm:p-6 shadow-2xl border-2 border-[#FF2A85] text-center space-y-4 animate-pop text-[#2B0B2E]">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDownsellModal(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#FAF2F7] text-[#6B5469] hover:text-[#2B0B2E] hover:bg-[#F0DCEB] flex items-center justify-center transition-all cursor-pointer border border-[#F0DCEB]"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Emergency Top Badge */}
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-[#FF2A85] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md font-heading animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
              <span>🚨 ÚLTIMA OPORTUNIDAD: 50% EXTRA OFF</span>
            </div>

            {/* Modal Heading */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#2B0B2E] leading-tight font-heading">
                ¡No Te Vayas Con Las Manos Vacías! 🎁
              </h2>
              <p className="text-xs text-[#6B5469] font-medium leading-relaxed">
                El Coach Luca autorizó un <strong className="text-[#FF2A85]">Subsidio Especial de Emergencia</strong> para que el dinero no te impida tener los glúteos que deseas:
              </p>
            </div>

            {/* Half Price Highlight Box */}
            <div className="bg-[#FAF2F7] rounded-2xl p-4 border-2 border-dashed border-[#FF2A85] space-y-1.5 shadow-inner">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-[#91798E] line-through">
                  Precio anterior: $9.90
                </span>
                <span className="text-[11px] font-black text-white bg-[#FF2A85] px-2 py-0.5 rounded-full uppercase">
                  Subsidio Especial
                </span>
              </div>
              
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-[#059669] font-heading tracking-tight">
                  $5.90
                </span>
                <span className="text-xs font-black text-[#2B0B2E] uppercase">
                  (Pago Único)
                </span>
              </div>

              <span className="text-[10px] font-black text-[#FF2A85] block pt-0.5">
                ⚡ Te llevas TODO el plan completo por solo $5.90 hoy.
              </span>
            </div>

            {/* Fast Benefit Checklist */}
            <div className="bg-[#FAF2F7] rounded-xl p-3 text-left space-y-1.5 text-xs font-medium text-[#2B0B2E] border border-[#F0DCEB]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Protocolo Glúteos Brasileños 28D Completo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Guía Nutricional Anti-Flacidez + Todos los Bônus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Garantía Total de 30 Días (Riesgo Cero)</span>
              </div>
            </div>

            {/* Modal Primary CTA ($5.90) */}
            <div className="space-y-2 pt-1">
              <a
                href={DOWNSELL_CHECKOUT_URL}
                onClick={(e) => handleCheckout(e, true)}
                className="w-full py-4 px-5 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#10B981] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-[0_10px_24px_rgba(255,42,133,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer font-heading uppercase tracking-wide group animate-pulse border-none text-center no-underline"
              >
                <Tag className="w-4 h-4 text-[#FFE600] fill-[#FFE600] shrink-0" />
                <span>👉 SÍ, QUIERO MI PLAN POR SOLO $5.90</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </a>

              <button
                type="button"
                onClick={() => setShowDownsellModal(false)}
                className="text-[11px] font-bold text-[#91798E] hover:text-red-500 transition-colors cursor-pointer block mx-auto pt-1"
              >
                No gracias, prefiero perder mi beca y pagar el precio completo después
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

