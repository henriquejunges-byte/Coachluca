import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Star, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Zap, 
  Gift, 
  Users, 
  Lock,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { TESTIMONIALS, BEFORE_AFTER_CASES, ASSETS, CHECKOUT_URL } from '../data/quizData';
import { trackCheckoutClick } from '../utils/pixel';
import HeaderLogo from './HeaderLogo';
import DiagnosticReportCard from './DiagnosticReportCard';

export default function ResultStep({ userAnswers }) {
  const selectedAge = userAnswers[2] || "30-39";
  const [timeLeft, setTimeLeft] = useState(599); // 09:59 countdown
  const [recentBuyer, setRecentBuyer] = useState(null);

  // REAL-TIME RECENT BUYERS POP-UP NOTIFICATIONS
  const buyersList = [
    { name: 'Juliana M.', city: 'Madrid - España', time: 'hace 1 min' },
    { name: 'Carolina R.', city: 'Buenos Aires - Argentina', time: 'hace 2 min' },
    { name: 'Fernanda S.', city: 'Ciudad de México - México', time: 'hace 3 min' },
    { name: 'Patrícia A.', city: 'Bogotá - Colombia', time: 'hace 4 min' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let index = 0;
    // Show next buyer notification every 8 seconds
    const popupInterval = setInterval(() => {
      setRecentBuyer(buyersList[index % buyersList.length]);
      index++;
      setTimeout(() => setRecentBuyer(null), 4000);
    }, 8000);

    return () => clearInterval(popupInterval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-6 px-3.5 sm:px-5 flex flex-col justify-center items-center font-body text-[#2B0B2E]">
      
      {/* LIVE SOCIAL PROOF POP-UP NOTIFICATION */}
      {recentBuyer && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white text-[#2B0B2E] border-2 border-[#FF2A85] px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs animate-pop font-heading">
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white font-black shrink-0 shadow-xs">
            ✓
          </div>
          <div>
            <p className="font-black text-[#2B0B2E] leading-tight">
              {recentBuyer.name} <span className="text-[#FF2A85] font-semibold">({recentBuyer.city})</span>
            </p>
            <p className="text-[10px] text-[#6B5469] font-bold">
              Obtuvo el protocolo de <span className="underline font-black text-[#FF2A85]">$ 9,90</span> {recentBuyer.time} 🎉
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-3.5">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* URGENCY ALERT BANNER */}
        <div className="bg-[#FFF5F9] text-[#2B0B2E] rounded-2xl p-2.5 px-4 shadow-sm flex items-center justify-between text-xs font-black font-heading border-2 border-[#FF2A85] animate-pulse">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#FF2A85] shrink-0" />
            <span className="text-[11px] text-[#2B0B2E]">⚠️ ATENCIÓN: SOLO QUEDAN 2 PLAZAS A ESTE PRECIO</span>
          </span>
          <span className="font-mono bg-[#FF2A85] px-2 py-0.5 rounded text-white font-black text-xs shadow-2xs">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-xl border border-[#F0D2E4] animate-pop space-y-5 quiz-card text-[#2B0B2E]">
          
          {/* Top Question / Result Banner */}
          <div className="rounded-[24px] p-5 text-center space-y-2 shadow-[0_14px_32px_rgba(255,42,133,0.35)] quiz-question-banner relative overflow-hidden font-heading text-white">
            <span className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#FF2A85]">
              <Sparkles className="w-3.5 h-3.5 text-[#19041C] fill-[#FFE600]" />
              Diagnóstico de Perfil Completo
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-xs">
              Tu Protocolo Glúteos Brasileños
            </h2>
            <p className="text-xs sm:text-sm text-white/95 font-medium font-body">
              Calibrado a medida para tu rango de edad <span className="font-black underline decoration-[#FFE600]">{selectedAge}</span>
            </p>
          </div>

          {/* DIAGNOSTIC REPORT DASHBOARD CARD */}
          <DiagnosticReportCard userAnswers={userAnswers} />

          {/* $ 9,90 DISCOUNT UNLOCKED BANNER */}
          <div className="bg-[#FAF2F7] text-[#2B0B2E] rounded-[22px] p-5 shadow-xs text-center space-y-2.5 border-2 border-[#FF2A85] animate-pop font-heading">
            <div className="inline-flex items-center gap-1.5 bg-[#2B0B2E] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <Tag className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              CUPÓN EXCLUSIVO APLICADO (#PGB990)
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-lg sm:text-xl font-bold text-[#91798E] line-through">
                $ 97,00
              </span>
              <div className="flex flex-col items-start">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF2A85] tracking-tight leading-none drop-shadow-xs">
                  $ 9,90
                </span>
                <span className="text-[11px] font-black text-[#2B0B2E] uppercase pt-0.5">¡Pago Único • Acceso Inmediato!</span>
              </div>
            </div>
            
            <p className="text-xs font-black text-[#2B0B2E] bg-white py-1.5 px-3 rounded-xl border border-[#F0DCEB] inline-block shadow-2xs font-body">
              🎉 ¡Ahorras $ 87,10 y pagas solo <span className="text-[#FF2A85] font-black">$ 9,90</span> por acceso completo de por vida!
            </p>
          </div>

          {/* APP PREVIEW BANNER */}
          <div className="relative rounded-[22px] overflow-hidden border border-[#F0D2E4] shadow-sm group bg-[#FAF2F7]">
            <img 
              src={ASSETS.gifs.sales1} 
              alt="Protocolo Glúteos Brasileños App Preview" 
              className="w-full object-cover max-h-64 sm:max-h-72 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#2B0B2E] text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-[#F0DCEB] font-heading">
              <Zap className="w-4 h-4 text-[#FF2A85] fill-[#FFE600]" />
              Acceso Inmediato en tu Móvil
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] text-center shadow-2xs font-heading">
              <span className="block text-2xl sm:text-3xl font-black text-[#FF2A85]">+4 a +7 cm</span>
              <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wide">Volumen Estimado</span>
            </div>
            <div className="bg-[#FAF2F7] p-3.5 rounded-2xl border border-[#F0DCEB] text-center shadow-2xs font-heading">
              <span className="block text-2xl sm:text-3xl font-black text-[#FF2A85]">28 Días</span>
              <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wide">Resultados Visibles</span>
            </div>
          </div>

          {/* STACK COMPLETO DE VALOR PERCEBIDO */}
          <div className="bg-[#FAF2F7] text-[#2B0B2E] rounded-[24px] p-5 border border-[#F0DCEB] space-y-4 shadow-xs font-heading">
            <div className="flex items-center justify-between border-b border-[#F0DCEB] pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#FF2A85]" />
                <h3 className="font-black text-[#2B0B2E] text-base">Todo lo que vas a recibir en el Protocolo:</h3>
              </div>
              <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#10B981]/30">
                Acceso De Por Vida
              </span>
            </div>

            {/* LISTA DE CONTEÚDOS COM VALOR INDIVIDUAL E CHECKS */}
            <div className="space-y-3 font-body">
              
              {/* ITEM 1 */}
              <div className="flex items-start justify-between gap-3 bg-white p-3 rounded-xl border border-[#F0DCEB] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">📱 Aplicación Exclusiva PGB (Acceso Completo)</span>
                    <span className="text-[11px] text-[#6B5469] block">Entrenamientos guiados en vídeo paso a paso</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#91798E] line-through shrink-0 font-heading">$ 97</span>
              </div>

              {/* ITEM 2 */}
              <div className="flex items-start justify-between gap-3 bg-white p-3 rounded-xl border border-[#F0DCEB] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">🏋️‍♀️ Rutinas de 8 a 10 min/día con Coach Luca</span>
                    <span className="text-[11px] text-[#6B5469] block">Activación neuromuscular progresiva sin gimnasio</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#91798E] line-through shrink-0 font-heading">$ 67</span>
              </div>

              {/* ITEM 3 */}
              <div className="flex items-start justify-between gap-3 bg-white p-3 rounded-xl border border-[#F0DCEB] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">🥗 Guía Nutricional para Apoyar tus Entrenamientos</span>
                    <span className="text-[11px] text-[#6B5469] block">Plan práctico para volumen y firmeza glútea</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#91798E] line-through shrink-0 font-heading">$ 47</span>
              </div>

              {/* BÔNUS 1 */}
              <div className="flex items-start justify-between gap-3 bg-[#FFF5F9] p-3 rounded-xl border border-[#F0D2E4] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <Gift className="w-5 h-5 text-[#FF2A85] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">🎁 BONO 1: Rutina Rápida de 15 Minutos</span>
                    <span className="text-[11px] text-[#6B5469] block">Para días con poco tiempo de entrenamiento</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#059669] shrink-0 font-heading">GRATIS</span>
              </div>

              {/* BÔNUS 2 */}
              <div className="flex items-start justify-between gap-3 bg-[#FFF5F9] p-3 rounded-xl border border-[#F0D2E4] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <Gift className="w-5 h-5 text-[#FF2A85] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">🎁 BONO 2: Calendario Imprimible de Progreso</span>
                    <span className="text-[11px] text-[#6B5469] block">Seguimiento de tu evolución en 28 días</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#059669] shrink-0 font-heading">GRATIS</span>
              </div>

              {/* BÔNUS 3 */}
              <div className="flex items-start justify-between gap-3 bg-[#FFF5F9] p-3 rounded-xl border border-[#F0D2E4] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <Users className="w-5 h-5 text-[#FF2A85] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B0B2E] block font-heading">🎁 BONO 3: Guía de Movilidad de Cadera y Piernas</span>
                    <span className="text-[11px] text-[#6B5469] block">Preparación articular para mejor ejecución</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#059669] shrink-0 font-heading">GRATIS</span>
              </div>

            </div>

            {/* RESUMO FINAL DE ECONOMIA */}
            <div className="bg-white rounded-2xl p-4 border-2 border-[#FF2A85] space-y-2 text-center shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#91798E] font-heading">
                <span>VALOR TOTAL ACUMULADO:</span>
                <span className="text-[#91798E] line-through text-sm">$ 211,00</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-black text-[#2B0B2E] font-heading">
                <span>TÚ PAGAS HOY SOLO:</span>
                <span className="text-2xl sm:text-3xl text-[#FF2A85] drop-shadow-xs">$ 9,90</span>
              </div>
              <p className="text-[11px] font-black text-[#059669]">
                ⚡ Ahorro Real de $ 201,10 (Obtienes Descuento de Lanzamiento)
              </p>
            </div>
          </div>

          {/* SEÇÃO DE PROVAS SOCIAIS */}
          <div className="space-y-3 pt-1 border-t border-[#F0DCEB]">
            <div className="flex items-center justify-between font-heading">
              <h3 className="font-black text-[#2B0B2E] text-base sm:text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF2A85]" />
                <span>Resultados Reales de Alumnas</span>
              </h3>
              <span className="text-xs font-black bg-[#FFE600] text-[#19041C] px-3 py-1 rounded-full border border-[#FFE600]">
                +14.800 Casos
              </span>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-3">
              {BEFORE_AFTER_CASES.map((item) => (
                <div key={item.id} className="group rounded-2xl overflow-hidden border border-[#F0DCEB] bg-[#FAF2F7] p-2 space-y-1.5 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="relative rounded-xl overflow-hidden h-36 sm:h-44 bg-white">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 right-2 bg-white/90 text-[#2B0B2E] text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-[#F0DCEB] font-heading shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                  <div className="px-1 space-y-0.5 text-left font-heading">
                    <p className="text-xs font-bold text-[#2B0B2E] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#FF2A85] font-black">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEPOIMENTOS DE ALUNAS COM AVATARES */}
          <div className="space-y-3 pt-1 font-heading">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#2B0B2E] text-base sm:text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
                <span>Opiniones Verificadas de Alumnas</span>
              </h3>
            </div>

            <div className="space-y-3 font-body">
              {TESTIMONIALS.map((t, idx) => (
                <div key={t.name} className="bg-[#FAF2F7] rounded-2xl p-4 border border-[#F0DCEB] text-left space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-heading">
                      {t.avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F0DCEB] shrink-0 bg-white shadow-2xs">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#FF2A85] text-white font-black flex items-center justify-center text-xs shrink-0">
                          {t.name[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#2B0B2E] text-xs sm:text-sm block">{t.name}</span>
                        <span className="text-[10px] text-[#6B5469] font-medium">{t.location} • {t.age}</span>
                      </div>
                    </div>
                    <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#10B981]/30 font-heading">
                      Alumna Verificada ✓
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5469] font-medium leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* GARANTIA E SEGURANÇA */}
          <div className="bg-[#ECFDF5] rounded-2xl p-4.5 border border-[#10B981]/40 space-y-2 text-center shadow-xs font-heading">
            <div className="flex items-center justify-center gap-2 text-[#059669]">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              <span className="font-bold text-xs sm:text-sm">Garantía de Satisfacción de 7 Días (Cero Riesgo)</span>
            </div>
            <p className="text-xs text-[#065F46] leading-relaxed font-medium font-body">
              Prueba el Protocolo Glúteos Brasileños por solo $ 9,90 sin riesgo alguno. Si en 7 días no estás plenamente satisfecha con las rutinas, simplemente solicita la devolución y reembolsaremos el 100% de tu dinero inmediatamente.
            </p>
          </div>

          {/* HIGH-CONVERTING CTA BUTTON */}
          <div className="space-y-3 pt-1">
            <a
              href={CHECKOUT_URL}
              onClick={(e) => {
                e.preventDefault();
                trackCheckoutClick();
              }}
              className="w-full py-4 sm:py-5 px-6 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#FF3377] hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group uppercase tracking-wide font-heading border-none text-center no-underline"
            >
              <Flame className="w-6 h-6 text-[#FFE600] fill-[#FFE600] shrink-0 drop-shadow-xs" />
              <span>QUIERO EMPEZAR EL PROTOCOLO</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>

            <div className="flex items-center justify-center gap-4 text-[#91798E] text-xs font-medium pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#FF2A85]" /> Pago 100% Seguro
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#10B981]" /> Acceso Inmediato
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

