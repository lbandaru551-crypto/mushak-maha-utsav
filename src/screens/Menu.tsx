// ============================================================
// MENU SCREEN — Title screen with animated festival decorations.
// Shows the game title, start/tutorial/best-score buttons.
// ============================================================

import { useState, useEffect } from 'react';
import Petals from '@/components/Petals';
import Diya from '@/components/Diya';
import Mushak from '@/components/Mushak';
import { getBestScore } from '@/game/storage';
import { sfxClick, initAudio } from '@/game/audio';

interface MenuProps {
  onStart: () => void;
  onTutorial: () => void;
  onLeaderboard: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export default function Menu({ onStart, onTutorial, onLeaderboard, muted, onToggleMute }: MenuProps) {
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  const handleStart = () => {
    initAudio();
    sfxClick();
    onStart();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden rangoli-bg">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #FFF7E8 0%, #FBEFD4 40%, #FFF7E8 100%)',
        }}
      />

      {/* Decorative spinning mandala watermark */}
      <div className="mandala-bg animate-mandalaSpin">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g fill="none" stroke="#7A2A38" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="72" />
            <circle cx="100" cy="100" r="54" />
            <circle cx="100" cy="100" r="36" />
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={100 + 36 * Math.cos(angle)}
                  y1={100 + 36 * Math.sin(angle)}
                  x2={100 + 90 * Math.cos(angle)}
                  y2={100 + 90 * Math.sin(angle)}
                />
              );
            })}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              return (
                <ellipse
                  key={i}
                  cx={100 + 54 * Math.cos(angle)}
                  cy={100 + 54 * Math.sin(angle)}
                  rx="18"
                  ry="8"
                  transform={`rotate(${(i * 45)} ${100 + 54 * Math.cos(angle)} ${100 + 54 * Math.sin(angle)})`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Decorative diyas at bottom corners */}
      <div className="absolute bottom-8 left-4 sm:left-8 z-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <Diya size={56} />
      </div>
      <div className="absolute bottom-8 right-4 sm:right-8 z-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <Diya size={56} />
      </div>

      {/* Mute button */}
      <button
        onClick={() => {
          sfxClick();
          onToggleMute();
        }}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-cream-100 shadow-soft flex items-center justify-center btn-press"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <span className="text-lg">{muted ? '🔇' : '🔊'}</span>
      </button>

      <Petals count={14} />

      {/* Title block */}
      <div className="text-center z-10 animate-scaleIn">
        {/* Small decorative line */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gold-400 opacity-50" />
          <span className="text-gold-500 text-sm font-body tracking-[0.3em] uppercase">Ganesh Utsav</span>
          <div className="h-px w-12 bg-gold-400 opacity-50" />
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-maroon-700 leading-none"
          style={{ textShadow: '0 2px 12px rgba(122, 42, 56, 0.08)' }}
        >
          MUSHAK
        </h1>
        <div className="my-2 text-3xl text-saffron-500 font-display">&amp;</div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-maroon-700 leading-tight"
          style={{ textShadow: '0 2px 12px rgba(122, 42, 56, 0.08)' }}
        >
          THE MAHA UTSAV
        </h1>

        <p className="mt-6 text-base sm:text-lg text-maroon-500 font-body font-semibold tracking-wide">
          Prepare the Perfect Ganesh Utsav
        </p>
      </div>

      {/* Mushak illustration with soft glow and gentle float */}
      <div className="relative my-8 z-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {/* Soft golden glow behind Mushak */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(255, 159, 28, 0.12) 0%, transparent 70%)',
          }}
        />
        <div className="animate-gentleFloat" style={{ animationDelay: '0.5s' }}>
          <Mushak size={110} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 z-10 w-full max-w-xs animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={handleStart}
          className="w-full py-5 px-8 rounded-2xl bg-maroon-600 text-cream-50 font-body font-bold text-lg shadow-card btn-press hover:bg-maroon-500 transition-all ring-2 ring-gold-400/60 hover:ring-gold-400 hover:shadow-glow"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          START UTSAV
        </button>
        <button
          onClick={() => {
            sfxClick();
            onTutorial();
          }}
          className="w-full py-3 px-8 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors border border-saffron-300/40"
        >
          HOW TO PLAY
        </button>
        <button
          onClick={() => {
            sfxClick();
            onLeaderboard();
          }}
          className="w-full py-3 px-8 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors border border-saffron-300/40"
        >
          BEST SCORE: {bestScore.toLocaleString()}
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-2 text-xs text-maroon-400/60 font-body z-10 safe-bottom">
        A respectful Ganesh Chaturthi celebration game
      </p>
    </div>
  );
}
