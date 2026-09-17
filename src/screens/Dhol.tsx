// ============================================================
// DHOL RHYTHM — Mini-game 4
// A rhythm game where beats scroll toward a hit line.
// Desktop: A S D F keys. Mobile: 4 large touch buttons.
// Timing categories: MISS / GOOD / GREAT / PERFECT.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import HUD from '@/components/HUD';
import StageIntro from '@/components/StageIntro';
import StageComplete from '@/components/StageComplete';
import { DHOL_KEYS, SCORE } from '@/game/constants';
import type { ScorePopup } from '@/game/types';
import { sfxDrum, sfxCorrect, sfxPerfect, sfxMistake, sfxComplete } from '@/game/audio';

interface DholProps {
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  muted: boolean;
  onToggleMute: () => void;
  onComplete: (stageScore: number, harmonyDelta: number) => void;
}

interface Beat {
  id: number;
  lane: number; // 0-3
  position: number; // 0-100 (0 = spawn, 100 = hit line)
  hit: boolean;
  missed: boolean;
}

const TOTAL_BEATS = 16;
const BEAT_INTERVAL = 700; // ms between beats
const TRAVEL_TIME = 2000; // ms for a beat to travel from spawn to hit line
const PERFECT_WINDOW = 120; // ms
const GREAT_WINDOW = 250;
const GOOD_WINDOW = 400;

export default function Dhol({
  score,
  harmony,
  stageIndex,
  totalStages,
  muted,
  onToggleMute,
  onComplete,
}: DholProps) {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [phase, setPhase] = useState<'play' | 'feedback'>('play');
  const [showComplete, setShowComplete] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hitFeedback, setHitFeedback] = useState<{ text: string; color: string } | null>(null);
  const [hitRingPulse, setHitRingPulse] = useState<number | null>(null);
  const [activeLane, setActiveLane] = useState<number | null>(null);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [beatsHit, setBeatsHit] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const beatId = useRef(0);
  const spawnCount = useRef(0);
  const animFrame = useRef<number>(0);
  const lastFrame = useRef(0);
  const completedRef = useRef(false);

  // Refs to hold latest values for use inside the rAF loop and setTimeout
  const roundScoreRef = useRef(0);
  const beatsHitRef = useRef(0);
  const perfectCountRef = useRef(0);
  const maxComboRef = useRef(0);
  const beatsRef = useRef<Beat[]>([]);

  useEffect(() => { roundScoreRef.current = roundScore; }, [roundScore]);
  useEffect(() => { beatsHitRef.current = beatsHit; }, [beatsHit]);
  useEffect(() => { perfectCountRef.current = perfectCount; }, [perfectCount]);
  useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
  useEffect(() => { beatsRef.current = beats; }, [beats]);

  const addPopup = useCallback((text: string, color: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 1500);
  }, []);

  // Generate a random beat pattern (replayable)
  const beatPattern = useRef<number[]>([]);
  useEffect(() => {
    const pattern: number[] = [];
    for (let i = 0; i < TOTAL_BEATS; i++) {
      let lane = Math.floor(Math.random() * 4);
      if (i > 0 && pattern[i - 1] === lane && Math.random() < 0.7) {
        lane = (lane + 1 + Math.floor(Math.random() * 3)) % 4;
      }
      pattern.push(lane);
    }
    beatPattern.current = pattern;
  }, []);

  // Spawn beats
  useEffect(() => {
    if (phase !== 'play') return;
    const spawn = () => {
      if (spawnCount.current >= TOTAL_BEATS) return;
      const lane = beatPattern.current[spawnCount.current] ?? 0;
      const id = beatId.current++;
      setBeats((prev) => [
        ...prev,
        { id, lane, position: 0, hit: false, missed: false },
      ]);
      spawnCount.current++;
    };

    spawn();
    const interval = setInterval(spawn, BEAT_INTERVAL);
    return () => clearInterval(interval);
  }, [phase]);

  // Animation loop: move beats forward — deps only [phase] so it doesn't tear down on score changes
  useEffect(() => {
    if (phase !== 'play') return;
    const loop = (now: number) => {
      if (lastFrame.current === 0) lastFrame.current = now;
      const dt = now - lastFrame.current;
      lastFrame.current = now;

      setBeats((prev) =>
        prev.map((beat) => {
          if (beat.hit || beat.missed) return beat;
          const newPos = beat.position + (dt / TRAVEL_TIME) * 100;
          if (newPos > 115) {
            return { ...beat, missed: true, position: newPos };
          }
          return { ...beat, position: newPos };
        }),
      );

      // Check if all beats are done — read from ref to avoid stale closure
      const allSpawned = spawnCount.current >= TOTAL_BEATS;
      if (allSpawned && !completedRef.current) {
        const allFinished = beatsRef.current.every((b) => b.hit || b.missed);
        if (allFinished) {
          completedRef.current = true;
          setPhase('feedback');
          const ph = perfectCountRef.current;
          const bh = beatsHitRef.current;
          const mc = maxComboRef.current;
          const rs = roundScoreRef.current;
          const harmonyDelta = ph >= TOTAL_BEATS * 0.6 ? 10 : bh >= TOTAL_BEATS * 0.4 ? 5 : 0;
          const comboBonus = mc * 20;
          const finalScore = rs + comboBonus;
          roundScoreRef.current = finalScore;
          setRoundScore(finalScore);
          setTimeout(() => {
            sfxComplete();
            setShowComplete(true);
            setTimeout(() => onComplete(finalScore, harmonyDelta), 1200);
          }, 1500);
        }
      }

      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animFrame.current);
      lastFrame.current = 0;
    };
  }, [phase, onComplete]);

  const handleHit = useCallback(
    (lane: number) => {
      if (phase !== 'play') return;
      sfxDrum();
      setActiveLane(lane);
      setTimeout(() => setActiveLane(null), 100);

      // Find the closest unhit beat in this lane near the hit line (position ~100)
      const candidates = beats.filter(
        (b) => b.lane === lane && !b.hit && !b.missed && b.position > 85 && b.position < 115,
      );

      if (candidates.length === 0) {
        sfxMistake();
        setCombo(0);
        setRoundScore((s) => Math.max(0, s + SCORE.MISTAKE));
        setHitFeedback({ text: 'MISS', color: '#9b3a4a' });
        setTimeout(() => setHitFeedback(null), 400);
        return;
      }

      const closest = candidates.reduce((best, b) =>
        Math.abs(b.position - 100) < Math.abs(best.position - 100) ? b : best,
      );
      const distance = Math.abs(closest.position - 100);

      let timing: 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS';
      let points: number;
      let color: string;

      if (distance < (PERFECT_WINDOW / TRAVEL_TIME) * 100) {
        timing = 'PERFECT';
        points = SCORE.CORRECT + 50;
        color = '#d4af37';
        setPerfectCount((c) => c + 1);
        sfxPerfect();
      } else if (distance < (GREAT_WINDOW / TRAVEL_TIME) * 100) {
        timing = 'GREAT';
        points = SCORE.CORRECT + 25;
        color = '#ff9f1c';
        sfxCorrect();
      } else if (distance < (GOOD_WINDOW / TRAVEL_TIME) * 100) {
        timing = 'GOOD';
        points = SCORE.CORRECT;
        color = '#5ba35b';
        sfxCorrect();
      } else {
        timing = 'MISS';
        points = SCORE.MISTAKE;
        color = '#9b3a4a';
        sfxMistake();
      }

      // Mark beat as hit
      setBeats((prev) => prev.map((b) => (b.id === closest.id ? { ...b, hit: true } : b)));
      setHitRingPulse(closest.lane);
      setTimeout(() => setHitRingPulse(null), 500);

      if (timing !== 'MISS') {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((m) => Math.max(m, newCombo));
        setBeatsHit((h) => h + 1);
        const comboMultiplier = Math.min(newCombo * 0.1, 1.5);
        const finalPoints = Math.round(points * (1 + comboMultiplier));
        setRoundScore((s) => s + finalPoints);
        addPopup(`+${finalPoints} ${timing}`, color, window.innerWidth / 2 - 50, window.innerHeight * 0.45);
      } else {
        setCombo(0);
        setRoundScore((s) => Math.max(0, s + points));
      }

      setHitFeedback({ text: timing, color });
      setTimeout(() => setHitFeedback(null), 400);
    },
    [phase, beats, combo, addPopup],
  );

  // Keyboard support
  useEffect(() => {
    if (phase !== 'play') return;
    const keyHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const lane = DHOL_KEYS.indexOf(key as (typeof DHOL_KEYS)[number]);
      if (lane !== -1) {
        e.preventDefault();
        handleHit(lane);
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [phase, handleHit]);

  return (
    <div className="min-h-screen game-screen flex flex-col items-center pt-20 pb-16 px-4 stage-enter">
      <StageIntro stage="DHOL" />
      {showComplete && <StageComplete stage="DHOL" />}
      <HUD
        stage="DHOL"
        score={score + roundScore}
        harmony={harmony}
        stageIndex={stageIndex}
        totalStages={totalStages}
        instruction="Tap the buttons when beats reach the gold line! Desktop: A S D F"
        muted={muted}
        onToggleMute={onToggleMute}
      />

      {/* Score popups */}
      {popups.map((p) => (
        <div
          key={p.id}
          className="fixed z-50 pointer-events-none font-display font-bold text-lg animate-floatUp"
          style={{ left: p.x, top: p.y, color: p.color }}
        >
          {p.text}
        </div>
      ))}

      <div className="w-full max-w-md flex flex-col items-center">
        <p className="font-body text-sm font-bold text-maroon-600 mb-2">Follow the Dhol rhythm!</p>

        {/* Timing feedback — large, centered, color-coded with ring */}
        <div className="h-12 mb-2 flex items-center justify-center">
          {hitFeedback && (
            <span
              className="font-display font-bold text-3xl sm:text-4xl animate-popBounce px-6 py-1 rounded-full"
              style={{
                color: hitFeedback.color,
                textShadow: `0 2px 12px ${hitFeedback.color}40`,
                border: `2px solid ${hitFeedback.color}40`,
                background: `${hitFeedback.color}10`,
              }}
            >
              {hitFeedback.text}
            </span>
          )}
        </div>

        {/* Rhythm track */}
        <div
          className="relative w-full rounded-3xl bg-gradient-to-b from-cream-100 to-cream-200 shadow-card overflow-hidden no-select"
          style={{ height: 'min(40vh, 280px)' }}
        >
          {/* 4 lanes */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3].map((lane) => (
              <div
                key={lane}
                className="flex-1 border-r border-cream-300/50 last:border-r-0 relative"
              >
                <div
                  className="absolute inset-0 transition-colors"
                  style={{
                    background: activeLane === lane ? 'rgba(255, 159, 28, 0.15)' : 'transparent',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Hit line — gold glowing line near bottom */}
          <div
            className={`absolute left-0 right-0 h-1 bg-gold-400 rounded-full transition-all ${phase === 'feedback' ? 'animate-glowPulse' : ''}`}
            style={{ bottom: '20%', boxShadow: '0 0 16px rgba(212, 175, 55, 0.6)' }}
          />
          {/* Hit ring pulse on the hit line when a beat is hit */}
          {hitRingPulse !== null && (
            <div
              className="absolute -translate-x-1/2 pointer-events-none"
              style={{
                left: `${hitRingPulse * 25 + 12.5}%`,
                bottom: '20%',
                transform: 'translate(-50%, 50%)',
              }}
            >
              <div className="w-12 h-12 rounded-full border-4 border-gold-400 animate-ringPulse" />
            </div>
          )}
          {/* Hit zone indicator — subtle band around the line */}
          <div
            className="absolute left-0 right-0 bg-saffron-300/10 rounded-lg pointer-events-none"
            style={{ bottom: '15%', height: '15%' }}
          />

          {/* Beats */}
          {beats.map((beat) => {
            if (beat.hit) return null;
            const laneWidth = 25; // percent
            const leftPercent = beat.lane * laneWidth + laneWidth / 2;
            // Map position 0-100 to top 5%-80% of container (hit line at ~80%)
            const topPercent = 5 + (beat.position / 100) * 75;

            return (
              <div
                key={beat.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-none"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  opacity: beat.missed ? 0.2 : 1,
                }}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-soft ${
                    beat.missed
                      ? 'bg-cream-300 grayscale'
                      : 'bg-gradient-to-br from-saffron-400 to-maroon-500 text-cream-50'
                  }`}
                >
                  {beat.missed ? '✕' : '●'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Touch buttons — large, clear labels for both mobile and desktop */}
        <div className="mt-4 w-full grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((lane) => (
            <button
              key={lane}
              onPointerDown={() => handleHit(lane)}
              disabled={phase !== 'play'}
              className={`py-6 rounded-2xl font-body font-bold text-base shadow-soft btn-press transition-all flex flex-col items-center gap-1 ${
                activeLane === lane
                  ? 'bg-saffron-500 text-cream-50 scale-95 shadow-glow'
                  : 'bg-cream-100 text-maroon-700 hover:bg-cream-200'
              }`}
              aria-label={`Dhol button ${lane + 1}`}
            >
              <span className="text-2xl">●</span>
              <span className="text-xs opacity-70 hidden sm:inline">{DHOL_KEYS[lane].toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Combo */}
        <div className="mt-3 h-6">
          {combo >= 3 && (
            <span className="font-display font-bold text-saffron-500 text-lg animate-popBounce">
              COMBO x{combo}! Max: {maxCombo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
