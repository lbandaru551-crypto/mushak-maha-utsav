// ============================================================
// HUD — Global heads-up display shown during all mini-games.
// Shows: stage name (left), Utsav Harmony bar (center), score (right).
// Optional timer and contextual instruction at the bottom.
// ============================================================

import { STAGE_NAMES } from '@/game/constants';
import type { GameStage } from '@/game/types';

interface HUDProps {
  stage: GameStage;
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  timer?: number;
  instruction: string;
  muted: boolean;
  onToggleMute: () => void;
}

export default function HUD({
  stage,
  score,
  harmony,
  stageIndex,
  totalStages,
  timer,
  instruction,
  muted,
  onToggleMute,
}: HUDProps) {
  const harmonyColor =
    harmony >= 80 ? '#5ba35b' : harmony >= 60 ? '#ff9f1c' : '#9b3a4a';

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="glass-card border-b border-saffron-300/20 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
          {/* Left: stage name + progress dots */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-body font-bold text-maroon-700 text-xs sm:text-sm truncate">
              {STAGE_NAMES[stage]}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalStages }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-colors ${
                    i < stageIndex
                      ? 'w-3 bg-eco-500'
                      : i === stageIndex
                        ? 'w-5 bg-saffron-500'
                        : 'w-3 bg-cream-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center: harmony bar */}
          <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-xs">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-body font-bold text-[10px] sm:text-xs text-maroon-600 uppercase tracking-wide">
                Utsav Harmony
              </span>
              <span className="font-body font-bold text-[10px] sm:text-xs" style={{ color: harmonyColor }}>
                {Math.round(harmony)}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-cream-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${harmony}%`,
                  background: 'linear-gradient(90deg, #9b3a4a 0%, #ff9f1c 50%, #5ba35b 100%)',
                }}
              />
            </div>
          </div>

          {/* Right: score + timer + mute */}
          <div className="flex items-center gap-2 sm:gap-3">
            {timer !== undefined && (
              <div className="flex flex-col items-center">
                <span className="font-body font-bold text-lg sm:text-xl text-maroon-700 tabular-nums">
                  {Math.ceil(timer)}
                </span>
                <span className="text-[9px] text-maroon-400 font-body uppercase">sec</span>
              </div>
            )}
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-lg sm:text-2xl text-saffron-500 tabular-nums leading-none">
                {score.toLocaleString()}
              </span>
              <span className="text-[9px] text-maroon-400 font-body uppercase">score</span>
            </div>
            <button
              onClick={onToggleMute}
              className="pointer-events-auto w-9 h-9 rounded-full bg-cream-100 shadow-soft flex items-center justify-center btn-press"
              aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            >
              <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom instruction bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="glass-card border-t border-saffron-300/20 px-4 py-2 text-center">
          <p className="font-body text-xs sm:text-sm text-maroon-600 font-semibold">
            {instruction}
          </p>
        </div>
      </div>
    </div>
  );
}
