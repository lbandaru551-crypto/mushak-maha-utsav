// ============================================================
// FINAL AARTI — The emotional finale of the game.
// A calm, beautiful festival scene with diyas, flowers, and
// a respectful Ganesha silhouette. Shows "UTSAV READY" and
// transitions to results after a few seconds.
// ============================================================

import { useState, useEffect } from 'react';
import Petals from '@/components/Petals';
import Diya from '@/components/Diya';
import GaneshaSilhouette from '@/components/GaneshaSilhouette';
import Mushak from '@/components/Mushak';
import { sfxAarti } from '@/game/audio';

interface AartiProps {
  harmony: number;
  onComplete: () => void;
}

const CHECKLIST = [
  { label: 'Rangoli', emoji: '🌀' },
  { label: 'Modaks', emoji: '🥮' },
  { label: 'Pandal', emoji: '🎏' },
  { label: 'Dhol', emoji: '🥁' },
  { label: 'Eco', emoji: '🌱' },
];

export default function Aarti({ harmony, onComplete }: AartiProps) {
  const [phase, setPhase] = useState<'enter' | 'scene' | 'checklist' | 'complete' | 'transition'>('enter');
  const [revealedItems, setRevealedItems] = useState(0);

  useEffect(() => {
    sfxAarti();
    const t1 = setTimeout(() => setPhase('scene'), 1200);
    const t2 = setTimeout(() => setPhase('checklist'), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Reveal checklist items one by one
  useEffect(() => {
    if (phase !== 'checklist') return;
    if (revealedItems >= CHECKLIST.length) {
      const t = setTimeout(() => setPhase('complete'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealedItems((n) => n + 1), 350);
    return () => clearTimeout(t);
  }, [phase, revealedItems]);

  // Transition to results after the complete moment
  useEffect(() => {
    if (phase !== 'complete') return;
    const t = setTimeout(() => {
      setPhase('transition');
      onComplete();
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, #FFEFCC 0%, #FFD89E 30%, #C9743E 70%, #7A2A38 100%)',
        }}
      />

      {/* Floating particles (diyas in background) */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 11}%`,
              bottom: `${5 + (i % 3) * 15}%`,
              animation: `floatUp ${4 + i * 0.5}s ease-in ${i * 0.3}s infinite`,
            }}
          >
            <div
              className="w-2 h-3 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, #FFD700 0%, #FF9F1C 50%, transparent 100%)',
                opacity: 0.6,
              }}
            />
          </div>
        ))}
      </div>

      <Petals count={20} />

      {/* ===== Phase: enter — calm transition message ===== */}
      {phase === 'enter' && (
        <div className="z-10 text-center animate-fadeIn">
          <p className="font-display text-2xl sm:text-3xl text-cream-50/80 italic">
            The Maha Utsav is ready.
          </p>
        </div>
      )}

      {/* ===== Phase: scene / checklist / complete — festival scene ===== */}
      {(phase === 'scene' || phase === 'checklist' || phase === 'complete') && (
        <div className="z-10 flex flex-col items-center animate-fadeIn">
          {/* Pandal arch frame */}
          <svg className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none" width="280" height="60" viewBox="0 0 280 60">
            <path d="M 0 60 Q 140 -15 280 60" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.3" />
            <path d="M 20 60 Q 140 5 260 60" fill="none" stroke="#9B3A4A" strokeWidth="1.5" opacity="0.2" />
          </svg>

          {/* Rangoli watermark behind Ganesha */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07]">
            <svg width="240" height="240" viewBox="0 0 200 200">
              <g fill="none" stroke="#7A2A38" strokeWidth="1">
                <circle cx="100" cy="100" r="90" />
                <circle cx="100" cy="100" r="70" />
                <circle cx="100" cy="100" r="50" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30 * Math.PI) / 180;
                  return <line key={i} x1={100 + 50 * Math.cos(a)} y1={100 + 50 * Math.sin(a)} x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} />;
                })}
              </g>
            </svg>
          </div>

          {/* Ganesha silhouette with aura */}
          <div className="relative mb-4">
            {/* Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-softGlow"
              style={{
                width: '260px',
                height: '260px',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%)',
              }}
            />
            <GaneshaSilhouette size={180} className="relative z-10" />
          </div>

          {/* Diyas flanking */}
          <div className="flex items-center gap-8 mb-4">
            <div className="relative">
              <div className="diya-glow" style={{ width: 80, height: 80, top: -20, left: -16 }} />
              <Diya size={48} />
            </div>
            <div className="relative">
              <div className="diya-glow" style={{ width: 100, height: 100, top: -28, left: -18 }} />
              <Diya size={64} />
            </div>
            <div className="relative">
              <div className="diya-glow" style={{ width: 80, height: 80, top: -20, left: -16 }} />
              <Diya size={48} />
            </div>
          </div>

          {/* Mushak at the bottom */}
          <div className="mb-4 animate-gentleFloat">
            <Mushak size={80} />
          </div>

          {/* Checklist build-up */}
          {phase === 'checklist' && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                {CHECKLIST.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-1.5 transition-all ${
                      i < revealedItems
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-75'
                    }`}
                    style={{
                      animation: i < revealedItems ? 'checkReveal 0.4s ease-out forwards' : 'none',
                    }}
                  >
                    <span className="text-xl sm:text-2xl">{item.emoji}</span>
                    <span className="font-body font-bold text-sm text-cream-50">{item.label}</span>
                    <span className="text-eco-300 font-bold text-sm">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UTSAV COMPLETE text */}
          {phase === 'complete' && (
            <div className="text-center animate-scaleIn">
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-cream-50 tracking-wide"
                style={{ textShadow: '0 2px 20px rgba(122, 42, 56, 0.5)' }}
              >
                UTSAV COMPLETE
              </h1>
              <p className="font-body text-base text-cream-100/80 mt-2">
                The celebration is complete
              </p>
            </div>
          )}

          {/* Harmony indicator */}
          <div className="mt-6 glass-card rounded-full px-6 py-2 shadow-card">
            <span className="font-body font-bold text-maroon-700 text-sm">
              Utsav Harmony: {Math.round(harmony)}%
            </span>
          </div>
        </div>
      )}

      {/* Loading transition */}
      {phase === 'transition' && (
        <div className="absolute inset-0 bg-cream-50 animate-fadeIn flex items-center justify-center z-20">
          <p className="font-display text-2xl text-maroon-700">Calculating your Utsav...</p>
        </div>
      )}
    </div>
  );
}
