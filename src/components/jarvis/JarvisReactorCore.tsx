import React from 'react';
import { Mic, Sparkles, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export type JarvisCoreState = 'idle' | 'listening' | 'processing' | 'generating' | 'completed' | 'alert';

interface JarvisReactorCoreProps {
  state?: JarvisCoreState;
  statusText?: string;
  isListening?: boolean;
  onToggleMic?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const JarvisReactorCore: React.FC<JarvisReactorCoreProps> = ({
  state = 'idle',
  statusText,
  isListening = false,
  onToggleMic,
  size = 'md',
}) => {
  const currentState = isListening ? 'listening' : state;

  // Determine state-specific colors and animation speeds
  let primaryColor = '#00f0ff'; // Electric cyan
  let secondaryColor = '#06b6d4';
  let glowColor = 'rgba(0, 240, 255, 0.4)';
  let spinDuration = '24s';
  let innerSpinDuration = '16s';

  if (currentState === 'listening') {
    primaryColor = '#38bdf8';
    secondaryColor = '#0284c7';
    glowColor = 'rgba(56, 189, 248, 0.6)';
    spinDuration = '10s';
    innerSpinDuration = '7s';
  } else if (currentState === 'processing' || currentState === 'generating') {
    primaryColor = '#00f0ff';
    secondaryColor = '#818cf8';
    glowColor = 'rgba(0, 240, 255, 0.7)';
    spinDuration = '5s';
    innerSpinDuration = '3.5s';
  } else if (currentState === 'completed') {
    primaryColor = '#10b981';
    secondaryColor = '#059669';
    glowColor = 'rgba(16, 185, 129, 0.5)';
  } else if (currentState === 'alert') {
    primaryColor = '#f59e0b';
    secondaryColor = '#d97706';
    glowColor = 'rgba(245, 158, 11, 0.5)';
  }

  const dimensions = size === 'sm' ? 'w-32 h-32' : size === 'lg' ? 'w-72 h-72' : 'w-56 h-56';

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Outer ambient glow */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          width: size === 'sm' ? '140px' : size === 'lg' ? '320px' : '260px',
          height: size === 'sm' ? '140px' : size === 'lg' ? '320px' : '260px',
          backgroundColor: glowColor,
          opacity: currentState === 'processing' || currentState === 'listening' ? 0.45 : 0.25,
        }}
      />

      {/* Main Core Container */}
      <div className={`relative ${dimensions} flex items-center justify-center`}>
        {/* Layer 1: Outermost segment ring with tick marks */}
        <svg
          className="absolute inset-0 w-full h-full animate-jarvis-spin pointer-events-none"
          style={{ animationDuration: spinDuration }}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="6 8 18 10 3 12"
            opacity="0.35"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeDasharray="40 18 25 15"
            opacity="0.6"
          />
          {/* Subtle tick markers at 4 cardinal points */}
          <line x1="100" y1="2" x2="100" y2="10" stroke={primaryColor} strokeWidth="2" opacity="0.8" />
          <line x1="100" y1="190" x2="100" y2="198" stroke={primaryColor} strokeWidth="2" opacity="0.8" />
          <line x1="2" y1="100" x2="10" y2="100" stroke={primaryColor} strokeWidth="2" opacity="0.8" />
          <line x1="190" y1="100" x2="198" y2="100" stroke={primaryColor} strokeWidth="2" opacity="0.8" />
        </svg>

        {/* Layer 2: Counter-rotating intermediate telemetry ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-jarvis-spin-reverse pointer-events-none"
          style={{ animationDuration: innerSpinDuration }}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="76"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="4 6 12 18"
            opacity="0.4"
          />
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeDasharray="28 14 60 20"
            opacity="0.75"
          />
          {/* Orbital satellite dots */}
          <circle cx="100" cy="34" r="2.5" fill={primaryColor} opacity="0.9" />
          <circle cx="100" cy="166" r="2.5" fill={primaryColor} opacity="0.9" />
          <circle cx="34" cy="100" r="2.5" fill={primaryColor} opacity="0.9" />
          <circle cx="166" cy="100" r="2.5" fill={primaryColor} opacity="0.9" />
        </svg>

        {/* Layer 3: Inner HUD bracket ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-jarvis-spin pointer-events-none"
          style={{ animationDuration: '32s' }}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeDasharray="16 28"
            opacity="0.5"
          />
        </svg>

        {/* Central Reactor Core Button / Indicator */}
        <button
          type="button"
          onClick={onToggleMic}
          disabled={!onToggleMic}
          title={isListening ? 'Click to stop listening' : onToggleMic ? 'Click to voice command JARVIS' : 'JARVIS AI System'}
          className={`relative z-10 rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer ${
            size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-28 h-28' : 'w-24 h-24'
          }`}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(9, 15, 29, 0.95) 75%)`,
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 24px ${glowColor}, inset 0 0 16px ${glowColor}`,
          }}
        >
          {/* State Icon in Center */}
          {currentState === 'listening' ? (
            <div className="flex flex-col items-center space-y-1">
              <Mic className="w-6 h-6 animate-pulse text-cyan-300" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                REC
              </span>
            </div>
          ) : currentState === 'processing' || currentState === 'generating' ? (
            <div className="flex flex-col items-center space-y-1">
              <Sparkles className="w-6 h-6 animate-spin text-cyan-300" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                AI
              </span>
            </div>
          ) : currentState === 'completed' ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          ) : currentState === 'alert' ? (
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          ) : (
            <div className="flex flex-col items-center space-y-0.5">
              <Cpu className="w-6 h-6 text-cyan-300" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                CORE
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Audio Waveform Equalizer (Animates when listening or generating) */}
      <div className="flex items-center space-x-1 mt-3 h-6">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
          const delay = `${(i * 0.12).toFixed(2)}s`;
          const isMid = i >= 4 && i <= 8;
          return (
            <span
              key={i}
              className="w-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: primaryColor,
                opacity: currentState === 'listening' ? 0.9 : currentState === 'processing' ? 0.7 : 0.35,
                height:
                  currentState === 'listening'
                    ? `${Math.max(6, Math.sin(i * 0.8) * 22 + (isMid ? 6 : 2))}px`
                    : currentState === 'processing'
                    ? `${Math.max(4, ((i % 4) + 1) * 4)}px`
                    : '4px',
                animation: currentState === 'listening' ? `jarvisWave 1s ease-in-out infinite alternate ${delay}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Status Label */}
      {statusText && (
        <div className="mt-2 text-center">
          <span
            className="text-xs font-mono font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: 'rgba(9, 15, 29, 0.75)',
              borderColor: 'rgba(0, 240, 255, 0.2)',
              color: primaryColor,
            }}
          >
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
