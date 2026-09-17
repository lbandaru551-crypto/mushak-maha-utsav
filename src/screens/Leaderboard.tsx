// ============================================================
// LEADERBOARD — Local high-score display.
// Shows best run, current run, personal record, and recent run history.
// Clearly labeled as LOCAL — no fake online scores.
// ============================================================

import { useState, useEffect } from 'react';
import Petals from '@/components/Petals';
import Diya from '@/components/Diya';
import { getBestScore, getRunHistory, getLastRun } from '@/game/storage';
import { getHarmonyTier } from '@/game/constants';
import type { RunResult } from '@/game/types';
import { sfxClick } from '@/game/audio';

interface LeaderboardProps {
  currentRun: RunResult | null;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function Leaderboard({ currentRun, onPlayAgain, onMainMenu }: LeaderboardProps) {
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<RunResult[]>([]);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);

  useEffect(() => {
    setBestScore(getBestScore());
    setHistory(getRunHistory());
    setLastRun(currentRun ?? getLastRun());
  }, [currentRun]);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden rangoli-bg">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #FFF7E8 0%, #FBEFD4 40%, #FFF7E8 100%)',
        }}
      />

      <Petals count={10} />

      <div className="absolute top-8 left-4 sm:left-8 z-10">
        <Diya size={40} />
      </div>
      <div className="absolute top-8 right-4 sm:right-8 z-10">
        <Diya size={40} />
      </div>

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-maroon-700">
            MAHA UTSAV LEADERBOARD
          </h1>
          <p className="font-body text-xs text-maroon-400 mt-1">
            Local scores — stored on this device only
          </p>
        </div>

        {/* Best run card */}
        <div className="glass-card rounded-2xl p-5 shadow-card mb-4 animate-scaleIn">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body font-bold text-xs text-saffron-500 uppercase tracking-wide">
              🏆 Best Run
            </span>
            <span className="font-body text-xs text-maroon-400">Personal Record</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-bold text-3xl text-saffron-500 tabular-nums">
              {bestScore.toLocaleString()}
            </span>
            {lastRun && (
              <span className="font-body text-xs text-maroon-500">
                {getHarmonyTier(lastRun.harmony).label}
              </span>
            )}
          </div>
        </div>

        {/* Current/Last run */}
        {lastRun && (
          <div className="glass-card rounded-2xl p-5 shadow-soft mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-body font-bold text-xs text-maroon-600 uppercase tracking-wide">
                Latest Run
              </span>
              <span className="font-body text-xs text-maroon-400">
                {lastRun.isNewBest ? 'NEW BEST!' : 'Completed'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-bold text-2xl text-maroon-700 tabular-nums">
                {lastRun.total.toLocaleString()}
              </span>
              <span className="font-body text-sm" style={{ color: getHarmonyTier(lastRun.harmony).color }}>
                {Math.round(lastRun.harmony)}% — {getHarmonyTier(lastRun.harmony).label}
              </span>
            </div>
          </div>
        )}

        {/* Run history */}
        {history.length > 0 && (
          <div className="glass-card rounded-2xl p-4 shadow-soft mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="font-body font-bold text-xs text-maroon-600 uppercase tracking-wide mb-3">
              Recent Runs
            </p>
            <div className="space-y-2">
              {history.slice(0, 5).map((run, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-cream-300/40 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-body font-bold text-sm text-maroon-400 w-6">
                      #{i + 1}
                    </span>
                    <span className="font-body text-xs text-maroon-500">
                      {formatDate(run.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-body text-xs"
                      style={{ color: getHarmonyTier(run.harmony).color }}
                    >
                      {Math.round(run.harmony)}%
                    </span>
                    <span className="font-body font-bold text-sm text-maroon-700 tabular-nums">
                      {run.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && !lastRun && (
          <div className="glass-card rounded-2xl p-6 shadow-soft mb-6 text-center">
            <p className="font-body text-sm text-maroon-400">
              No runs yet. Play a game to see your scores here!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => {
              sfxClick();
              onPlayAgain();
            }}
            className="w-full py-4 px-8 rounded-2xl bg-maroon-600 text-cream-50 font-body font-bold text-lg shadow-card btn-press hover:bg-maroon-500 transition-all ring-2 ring-gold-400/60 hover:ring-gold-400 hover:shadow-glow"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={() => {
              sfxClick();
              onMainMenu();
            }}
            className="w-full py-3 px-8 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
