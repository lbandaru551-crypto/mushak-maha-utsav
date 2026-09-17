// ============================================================
// STAGE COMPLETE — Overlay shown briefly when a mini-game finishes.
// Shows a continuity message, petal burst, and gentle fade.
// Does NOT change game state — purely visual, timed by the parent.
// ============================================================

import { useMemo } from 'react';
import { STAGE_COMPLETE_MESSAGES } from '@/game/constants';
import type { GameStage } from '@/game/types';

const BURST_COLORS = ['#F0A8C3', '#FFB13D', '#E8C97A', '#5BA35B', '#FF9F1C'];

interface StageCompleteProps {
  stage: GameStage;
}

export default function StageComplete({ stage }: StageCompleteProps) {
  const message = STAGE_COMPLETE_MESSAGES[stage] ?? 'Stage complete!';

  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 80 + Math.random() * 60;
      return {
        id: i,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        color: BURST_COLORS[i % BURST_COLORS.length],
        size: 10 + Math.random() * 8,
        delay: Math.random() * 0.15,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 animate-fadeIn"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 247, 232, 0.85) 0%, rgba(255, 247, 232, 0.5) 50%, transparent 100%)',
        }}
      />

      {/* Petal burst from center */}
      <div className="relative">
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `petalBurst 1.2s ease-out ${p.delay}s forwards`,
            }}
          >
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: '50% 0 50% 50%',
                opacity: 0.7,
                transform: 'rotate(45deg)',
                ['--tx' as string]: `${p.tx}px`,
                ['--ty' as string]: `${p.ty}px`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="relative z-10 text-center animate-scaleIn">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gold-400 opacity-60" />
          <span className="text-gold-500 text-xs font-body tracking-[0.25em] uppercase">Stage Complete</span>
          <div className="h-px w-8 bg-gold-400 opacity-60" />
        </div>
        <p className="font-display font-bold text-xl sm:text-2xl text-maroon-700 px-6"
          style={{ textShadow: '0 2px 12px rgba(255, 247, 232, 0.8)' }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
