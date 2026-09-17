// ============================================================
// STAGE INTRO — Brief banner shown at the start of each mini-game.
// Shows a continuity message and fades out after 2.5 seconds.
// Purely visual — no game state changes.
// ============================================================

import { useState, useEffect } from 'react';
import { STAGE_INTRO_MESSAGES } from '@/game/constants';
import type { GameStage } from '@/game/types';

interface StageIntroProps {
  stage: GameStage;
}

export default function StageIntro({ stage }: StageIntroProps) {
  const [visible, setVisible] = useState(true);
  const message = STAGE_INTRO_MESSAGES[stage] ?? '';

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [stage]);

  if (!message || !visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
      <div
        className="glass-card rounded-2xl px-6 py-4 shadow-card text-center"
        style={{ animation: visible ? 'fadeIn 0.4s ease-out forwards, fadeOut 0.5s ease-in 2s forwards' : 'none' }}
      >
        <p className="font-display font-bold text-lg sm:text-xl text-maroon-700">
          {message}
        </p>
      </div>
    </div>
  );
}
