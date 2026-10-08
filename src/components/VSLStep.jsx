import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Tv,
  Zap,
  Sparkles,
  Gift,
  ArrowRight,
  CheckCircle2,
  Flame,
  ShieldCheck
} from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import { ASSETS } from '../data/quizData';
import { trackVSLView, trackVSLPlay, trackVSLComplete, trackVSLProgress } from '../utils/pixel';

// Target duration in seconds of video playback to reach 100% (fast paced sensation)
const TARGET_PLAYED_SECONDS_FOR_100 = 12.0;

function computeProgress(currentTime, duration) {
  const effectiveTarget = Math.min(TARGET_PLAYED_SECONDS_FOR_100, duration * 0.7);
  const ratio = Math.min(1, currentTime / effectiveTarget);
  return {
    ratio,
    percent: Math.min(100, Math.round(Math.pow(ratio, 0.88) * 100))
  };
}

function getStatusMessage(isLoaderActive, roundedProgress) {
  if (!isLoaderActive) {
    return '👆 Toca en el vídeo para activar el audio y desbloquear tu Beca...';
  }
  if (roundedProgress >= 100) return '🎉 ¡BECA DEL 80% DESBLOQUEADA CON ÉXITO!';
  if (roundedProgress >= 70) return '🔥 ¡Últimos segundos! Desbloqueando tu Beca...';
  if (roundedProgress >= 30) return '⚡ Calibrando tu cupón exclusivo y diagnóstico...';
  return '▶️ Calibrando estímulo biomecánico en tiempo real...';
}

function getBadgeLabel(roundedProgress, isLoaderActive) {
  if (roundedProgress >= 100) return 'BECA LIBERADA';
  if (isLoaderActive) return `BECA: ${roundedProgress}%`;
  return 'TOCA PARA ACTIVAR';
}

function getBottomPillText(isLoaderActive, roundedProgress) {
  if (!isLoaderActive) {
    return '👆 Toca para activar audio y desbloquear tu Beca';
  }
  if (roundedProgress >= 100) {
    return '🎉 ¡Beca Desbloqueada! Toca abajo para reclamar';
  }
  if (roundedProgress >= 70) {
    return '🔥 ¡Últimos segundos! Desbloqueando Beca...';
  }
  return 'Mira la explicación para desbloquear tu Beca del 80%';
}

export default function VSLStep({ onContinue }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const tracked50 = useRef(false);
  const tracked80 = useRef(false);

  // Preload gif/cover on mount and ensure video is primed at 0:00
  useEffect(() => {
    trackVSLView();

    const gifPreload = new Image();
    gifPreload.src = ASSETS.vslCover || '/assets/capa-vsl.gif';

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, []);

  // SYNCHRONIZED PROGRESS CALCULATOR TIED TO REAL VIDEO PLAYBACK
  const handleTimeUpdate = useCallback(() => {
    if (!isLoaderActive || !videoRef.current) return;

    const currentTime = videoRef.current.currentTime || 0;
    const duration = videoRef.current.duration || TARGET_PLAYED_SECONDS_FOR_100;
    const { ratio, percent: pct } = computeProgress(currentTime, duration);

    setProgressPercent(pct);

    if (pct >= 50 && !tracked50.current) {
      tracked50.current = true;
      trackVSLProgress(50);
    }
    if (pct >= 80 && !tracked80.current) {
      tracked80.current = true;
      trackVSLProgress(80);
    }
    if (pct >= 100 || ratio >= 1) {
      setIsUnlocked(true);
    }
  }, [isLoaderActive]);

  // ACTIVATE VSL WITH SOUND AND START LOADER ON USER CLICK (ALWAYS FROM 0:00)
  const handleActivateAndPlay = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.muted = false;
    setIsMuted(false);
    setIsLoaderActive(true);

    videoRef.current.play().then(() => {
      setIsPlaying(true);
      trackVSLPlay();
    }).catch(() => {
      setIsPlaying(true);
    });
  };

  const handlePlayToggle = () => {
    if (!isLoaderActive) {
      handleActivateAndPlay();
      return;
    }

    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayToggle();
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (!isLoaderActive) {
      handleActivateAndPlay();
      return;
    }

    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (nextMuted === false && videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleContinue = () => {
    trackVSLComplete();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onContinue();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgressPercent(100);
    setIsUnlocked(true);
  };

  const roundedProgress = Math.round(progressPercent);
  const statusMessage = getStatusMessage(isLoaderActive, roundedProgress);
  const badgeLabel = getBadgeLabel(roundedProgress, isLoaderActive);
  const bottomPillText = getBottomPillText(isLoaderActive, roundedProgress);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-6 px-3.5 sm:px-6 flex flex-col justify-center items-center font-body text-[#2B0B2E]">
      
      <div className="w-full max-w-lg sm:max-w-xl mx-auto space-y-3.5">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* Clean Main VSL Card */}
        <div className="bg-white rounded-[28px] p-4 sm:p-7 shadow-xl border border-[#F0D2E4] space-y-4 text-center quiz-card animate-pop text-[#2B0B2E]">
          
          {/* Header Badge & Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[2px_2px_0px_#FF2A85] font-heading">
              <Tv className="w-3.5 h-3.5 text-[#19041C]" />
              <span>Vídeo Exclusivo • Protocolo Glúteos</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#2B0B2E] leading-tight font-heading">
              Mira la Explicación Antes de Continuar 🍑
            </h2>
            
            <p className="text-xs sm:text-sm text-[#6B5469] font-medium leading-relaxed font-body max-w-md mx-auto">
              Aprende el estímulo neuromuscular de <strong className="text-[#FF2A85]">8 a 10 min/día</strong> desde casa.
            </p>
          </div>

          {/* EXTERNAL PROGRESS BAR (TIED TO VIDEO PLAYBACK, FAST PACED) */}
          <div className={`rounded-[22px] p-3.5 border transition-all duration-300 space-y-2 text-left bg-[#FAF2F7] border-[#F0DCEB]`}>
            <div className="flex items-center justify-between gap-2 font-heading">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#2B0B2E]">
                {roundedProgress >= 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                ) : (
                  <Flame className={`w-4 h-4 shrink-0 ${isLoaderActive ? 'text-[#FF2A85] fill-[#FFE600] animate-pulse' : 'text-[#91798E]'}`} />
                )}
                <span>DESBLOQUEO DE BECA:</span>
              </span>
              <span className={`font-black text-sm px-2.5 py-0.5 rounded-full border shadow-2xs ${
                isLoaderActive ? 'text-[#FF2A85] bg-white border-[#FFE600]' : 'text-[#91798E] bg-white border-[#F0DCEB]'
              }`}>
                {roundedProgress}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="relative w-full h-3.5 bg-[#FAF0F6] rounded-full overflow-hidden p-0.5 border border-[#F0DCEB] shadow-inner">
              <div 
                className={`relative h-full rounded-full transition-all duration-150 ease-out ${
                  isLoaderActive
                    ? 'bg-gradient-to-r from-[#FF2A85] via-[#FFE600] to-[#10B981] shadow-[0_0_12px_rgba(255,42,133,0.6)]'
                    : 'bg-[#F0DCEB]'
                }`}
                style={{ width: `${Math.max(isLoaderActive ? 2 : 0, progressPercent)}%` }}
              >
                {isLoaderActive && isPlaying && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep" />
                )}
              </div>
            </div>

            {/* Dynamic Status Text */}
            <p className={`text-[11px] font-black flex items-center gap-1.5 font-heading pt-0.5 ${
              isLoaderActive ? 'text-[#6B5469]' : 'text-[#FF2A85] animate-pulse'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#FF2A85] shrink-0" />
              <span className="truncate">{statusMessage}</span>
            </p>
          </div>

          {/* MODERN VERTICAL VIDEO PLAYER */}
          <div 
            ref={containerRef}
            className="relative w-full max-w-[420px] sm:max-w-[460px] mx-auto rounded-[24px] overflow-hidden shadow-[0_14px_45px_rgba(255,42,133,0.25)] ring-4 ring-[#FF2A85]/20 border-2 border-[#FF2A85]/50 aspect-[9/13.5] select-none flex items-center justify-center group bg-black transition-all hover:ring-[#FF2A85]/40"
          >
            
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              playsInline
              disablePictureInPicture
              controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
              onContextMenu={(e) => e.preventDefault()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              className="w-full h-full object-cover bg-black pointer-events-none"
            >
              <source src={ASSETS.vsl || '/assets/vsl-video.mp4'} type="video/mp4" />
              <track kind="captions" />
            </video>

            {/* Native Full-Area Click Layer for Play / Pause */}
            <button
              type="button"
              onClick={handlePlayToggle}
              aria-label="Reproducir o pausar vídeo explicativo"
              className="absolute inset-0 z-10 w-full h-full bg-transparent cursor-pointer border-0 outline-hidden focus-visible:ring-4 focus-visible:ring-[#FFE600]"
            />

            {/* 1. TOP EDGE-TO-EDGE PROGRESS BAR WITH GLOW */}
            <div className="absolute top-0 left-0 right-0 z-40 h-3 bg-black/70 backdrop-blur-xs overflow-hidden pointer-events-none">
              <div 
                className="relative h-full rounded-r-full bg-gradient-to-r from-[#FF2A85] via-[#FFE600] to-[#10B981] shadow-[0_0_18px_rgba(255,42,133,1)] transition-all duration-150 ease-out"
                style={{ width: `${Math.max(isLoaderActive ? 2 : 0, progressPercent)}%` }}
              >
                {isLoaderActive && isPlaying && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-sweep" />
                )}
              </div>
            </div>

            {/* 2. FLOATING HUD OVERLAY (TOP INSIDE PLAYER) */}
            <div className="absolute top-4 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
              
              {/* Left Live Badge */}
              <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-[#FFE600]/60 text-white text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg font-heading">
                <span className="w-2 h-2 rounded-full bg-[#FF2A85] animate-ping" />
                <span>EN VIVO</span>
              </div>

              {/* Center Dynamic Retention Percentage Badge */}
              <div className="inline-flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-[#FFE600]/70 text-white text-[10px] sm:text-[11px] font-black px-3.5 py-1 rounded-full shadow-lg font-heading animate-pulse">
                {roundedProgress >= 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600] shrink-0" />
                )}
                <span className="bg-gradient-to-r from-white via-[#FFF4FA] to-[#FFE600] bg-clip-text text-transparent">
                  {badgeLabel}
                </span>
              </div>

              {/* Right Sound Toggle */}
              <button
                type="button"
                onClick={handleMuteToggle}
                className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#FF2A85] transition-all cursor-pointer border border-white/25 shadow-lg active:scale-90"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
            </div>

            {/* 3. FLOATING PERSISTENT BOTTOM RETENTION PILL */}
            <div className="absolute bottom-3.5 left-3 right-3 z-30 pointer-events-none">
              <div className="relative bg-black/85 backdrop-blur-md border border-[#FFE600]/50 rounded-full px-3.5 py-2 overflow-hidden shadow-xl text-center">
                
                {/* Subtle Inner Fill Layer in Pink Gradient */}
                {isLoaderActive && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF2A85]/30 via-[#FFE600]/25 to-[#FF5EAA]/20 transition-all duration-150 ease-out pointer-events-none"
                    style={{ width: `${progressPercent}%` }}
                  />
                )}

                {/* Bottom Micro-Bar Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#FF2A85] via-[#FFE600] to-[#10B981] transition-all duration-150 ease-out shadow-[0_0_8px_#FFE600]"
                    style={{ width: `${isLoaderActive ? progressPercent : 0}%` }}
                  />
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-white font-heading">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600] shrink-0" />
                  <span className="truncate">{bottomPillText}</span>
                </div>
              </div>
            </div>

            {/* 4. CENTRAL OVERLAY BUTTON (VISIBLE WHEN MUTED / BEFORE CLICK) */}
            {(!isLoaderActive || isMuted) && (
              <button
                type="button"
                onClick={handleActivateAndPlay}
                aria-label="Tocar para activar audio"
                className="absolute inset-0 z-20 w-full h-full bg-black/35 flex flex-col items-center justify-center text-center p-4 cursor-pointer border-0 outline-hidden"
              >
                <div className="flex flex-col items-center gap-2.5 max-w-xs p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-[#FFE600]/60 shadow-2xl animate-pop">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF2A85] via-[#FFE600] to-[#FF007F] text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,42,133,0.95)] border-2 border-white animate-pulse">
                    <Volume2 className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="space-y-0.5 font-heading">
                    <span className="text-white font-black text-sm uppercase block tracking-wide">
                      🔊 TOCAR PARA ACTIVAR AUDIO
                    </span>
                    <span className="text-[#FFE600] text-[11px] font-bold block">
                      Haz clic para iniciar la Beca del 80%
                    </span>
                  </div>
                </div>
              </button>
            )}

          </div>

          {/* UNLOCKED CTA BUTTON (APPEARS WHEN PROGRESS REACHES 100%) */}
          {isUnlocked ? (
            <div className="pt-2 animate-pop">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-4 sm:py-5 px-6 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#10B981] hover:brightness-105 text-white font-black text-base sm:text-lg shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer font-heading uppercase tracking-wide group animate-pulse"
              >
                <Gift className="w-5 h-5 text-white fill-white shrink-0" />
                <span>¡RECLAMAR MI BECA Y CUPÓN VIP!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#91798E] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Vídeo explicativo oficial con Coach Luca</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

