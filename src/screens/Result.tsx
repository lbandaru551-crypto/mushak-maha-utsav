// ============================================================
// RESULTS SCREEN — Polished final score display.
// Shows animated counting score, per-stage breakdown,
// harmony bar, and high-score celebration.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import Petals from '@/components/Petals';
import Diya from '@/components/Diya';
import { getHarmonyTier } from '@/game/constants';
import type { StageScore, RunResult } from '@/game/types';
import { sfxComplete, sfxPerfect } from '@/game/audio';

interface ResultProps {
  totalScore: number;
  harmony: number;
  stageScores: StageScore[];
  speedBonus: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onLeaderboard: () => void;
}

export default function Result({
  totalScore,
  harmony,
  stageScores,
  speedBonus,
  isNewBest,
  onPlayAgain,
  onMainMenu,
  onLeaderboard,
}: ResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showHarmony, setShowHarmony] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const animFrame = useRef<number>(0);

  const tier = getHarmonyTier(harmony);

  // Animate score counting up
  useEffect(() => {
    sfxComplete();
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(totalScore * eased));
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        setShowHarmony(true);
        setTimeout(() => setShowBreakdown(true), 500);
        if (isNewBest) {
          setTimeout(() => {
            sfxPerfect();
            setShowHighScore(true);
          }, 800);
        }
        setTimeout(() => setShowButtons(true), isNewBest ? 1400 : 1000);
      }
    };
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [totalScore, isNewBest]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden rangoli-bg">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #FFF7E8 0%, #FBEFD4 40%, #FFF7E8 100%)',
        }}
      />

      <Petals count={16} />

      {/* Decorative diyas with soft glow */}
      <div className="absolute top-8 left-4 sm:left-8 z-10">
        <div className="relative">
          <div className="diya-glow" style={{ width: 70, height: 70, top: -16, left: -15 }} />
          <Diya size={40} />
        </div>
      </div>
      <div className="absolute top-8 right-4 sm:right-8 z-10">
        <div className="relative">
          <div className="diya-glow" style={{ width: 70, height: 70, top: -16, left: -15 }} />
          <Diya size={40} />
        </div>
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Title */}
        <div className="text-center mb-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-10 bg-gold-400 opacity-50" />
            <span className="text-gold-500 text-xs font-body tracking-[0.25em] uppercase">Utsav Complete</span>
            <div className="h-px w-10 bg-gold-400 opacity-50" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-maroon-700"
            style={{ textShadow: '0 2px 12px rgba(122, 42, 56, 0.08)' }}
          >
            UTSAV COMPLETE!
          </h1>
          <p className="font-body text-sm text-maroon-500 mt-1">Your Ganesh Chaturthi celebration is ready</p>
        </div>

        {/* Score with radial glow */}
        <div className="relative text-center mb-3">
          <div className="score-glow-bg" />
          <div className="relative font-display font-bold text-5xl sm:text-7xl text-saffron-500 tabular-nums shimmer-text animate-scoreGlow">
            {displayScore.toLocaleString()}
          </div>
        </div>

        {/* Harmony tier — festival rating badge */}
        <div className="text-center mb-5">
          <span
            className="inline-block font-display font-bold text-xl sm:text-2xl px-6 py-2 rounded-full shadow-soft animate-badgePop"
            style={{ color: tier.color, background: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
          >
            {tier.label}
          </span>
        </div>

        {/* Harmony bar */}
        {showHarmony && (
          <div className="mb-6 animate-gentleRise">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body font-bold text-xs text-maroon-600 uppercase tracking-wide">
                Utsav Harmony
              </span>
              <span className="font-body font-bold text-sm" style={{ color: tier.color }}>
                {Math.round(harmony)}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-cream-200 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${harmony}%`,
                  background: 'linear-gradient(90deg, #9b3a4a 0%, #ff9f1c 50%, #5ba35b 100%)',
                }}
              />
            </div>
          </div>
        )}

        {/* Stage breakdown */}
        {showBreakdown && (
          <div className="glass-card rounded-2xl p-4 shadow-card mb-6 animate-slideUp">
            <div className="space-y-2">
              {stageScores.map((stage, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between animate-fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="font-body text-sm text-maroon-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-400" />
                    {stage.name}
                  </span>
                  <span className="font-body font-bold text-sm text-maroon-700 tabular-nums">
                    {stage.score.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t border-cream-300/50 pt-2 flex items-center justify-between">
                <span className="font-body text-sm text-saffron-600 font-bold">Speed Bonus</span>
                <span className="font-body font-bold text-sm text-saffron-600 tabular-nums">
                  +{speedBonus.toLocaleString()}
                </span>
              </div>
              <div className="festive-divider my-2">
                <span className="text-gold-400 text-xs font-body">✦</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-maroon-700 font-bold uppercase tracking-wide">Total</span>
                <span className="font-display font-bold text-2xl text-maroon-700 tabular-nums">
                  {totalScore.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* New high score banner — only if genuinely beaten */}
        {showHighScore && (
          <div className="text-center mb-4 animate-badgePop">
            <span className="font-display font-bold text-xl sm:text-2xl text-saffron-500 inline-block"
              style={{ textShadow: '0 2px 12px rgba(255, 159, 28, 0.3)' }}
            >
              ✨ NEW HIGH SCORE! ✨
            </span>
          </div>
        )}

        {/* Buttons */}
        {showButtons && (
          <div className="flex flex-col gap-3 animate-slideUp">
            <button
              onClick={onPlayAgain}
              className="w-full py-5 px-8 rounded-2xl bg-maroon-600 text-cream-50 font-body font-bold text-lg shadow-card btn-press hover:bg-maroon-500 transition-all ring-2 ring-gold-400/60 hover:ring-gold-400 hover:shadow-glow"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              PLAY AGAIN
            </button>
            <div className="flex gap-3">
              <button
                onClick={onLeaderboard}
                className="flex-1 py-3 px-6 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors"
              >
                LEADERBOARD
              </button>
              <button
                onClick={onMainMenu}
                className="flex-1 py-3 px-6 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
