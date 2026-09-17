// ============================================================
// MODAK RUSH — Mini-game 2
// Ingredients float across the screen. The player taps correct
// ingredients (rice flour, jaggery, coconut, ghee, cardamom) and
// avoids distractors (chili, salt, etc.). Build a perfect modak!
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import HUD from '@/components/HUD';
import StageIntro from '@/components/StageIntro';
import StageComplete from '@/components/StageComplete';
import { MODAK_INGREDIENTS, MODAK_DISTRACTORS, SCORE } from '@/game/constants';
import type { ScorePopup } from '@/game/types';
import { sfxCorrect, sfxMistake, sfxPerfect, sfxComplete, sfxCombo } from '@/game/audio';

interface ModakProps {
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  muted: boolean;
  onToggleMute: () => void;
  onComplete: (stageScore: number, harmonyDelta: number) => void;
}

interface FloatingItem {
  id: number;
  x: number; // 0-100 percent
  y: number; // 0-100 percent
  vx: number;
  vy: number;
  emoji: string;
  name: string;
  correct: boolean;
  collected: boolean;
}

const GAME_DURATION = 25; // seconds
const TARGET_CORRECT = 5; // need all 5 correct ingredients
const SPAWN_INTERVAL = 700; // ms

// Static combined list — created once, not per render
const ALL_INGREDIENTS = [...MODAK_INGREDIENTS, ...MODAK_DISTRACTORS];

export default function Modak({
  score,
  harmony,
  stageIndex,
  totalStages,
  muted,
  onToggleMute,
  onComplete,
}: ModakProps) {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [phase, setPhase] = useState<'play' | 'feedback'>('play');
  const [roundScore, setRoundScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const popupId = useRef(0);
  const itemId = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef<number>(0);

  // Refs that always hold the latest values — used inside setTimeout callbacks
  const roundScoreRef = useRef(0);
  const collectedRef = useRef<string[]>([]);
  const timerRef = useRef(GAME_DURATION);
  const phaseRef = useRef<'play' | 'feedback'>('play');
  const completedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { roundScoreRef.current = roundScore; }, [roundScore]);
  useEffect(() => { collectedRef.current = collected; }, [collected]);
  useEffect(() => { timerRef.current = timer; }, [timer]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const addPopup = useCallback((text: string, color: string, x: number, y: number) => {
    const id = popupId.current++;
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 2000);
  }, []);

  // Spawn items periodically — weighted so correct ingredients appear often enough
  useEffect(() => {
    if (phase !== 'play') return;

    const spawnInterval = setInterval(() => {
      if (phaseRef.current !== 'play') return;

      // 55% chance to spawn a correct ingredient that hasn't been collected yet,
      // 45% chance to spawn a random distractor
      const uncollectedCorrect = MODAK_INGREDIENTS.filter(
        (ing) => !collectedRef.current.includes(ing.name),
      );
      let ingredient: typeof ALL_INGREDIENTS[number];

      if (uncollectedCorrect.length > 0 && Math.random() < 0.55) {
        ingredient = uncollectedCorrect[Math.floor(Math.random() * uncollectedCorrect.length)];
      } else {
        ingredient = MODAK_DISTRACTORS[Math.floor(Math.random() * MODAK_DISTRACTORS.length)];
      }

      const id = itemId.current++;
      const x = 10 + Math.random() * 80;
      const y = 15 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.25 + Math.random() * 0.35;
      setItems((prev) => [
        ...prev.slice(-8), // keep at most 8 items on screen
        {
          id,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          emoji: ingredient.emoji,
          name: ingredient.name,
          correct: ingredient.correct,
          collected: false,
        },
      ]);
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [phase]); // only re-run when phase changes, not on every render

  // Move items via requestAnimationFrame
  useEffect(() => {
    if (phase !== 'play') return;
    const move = () => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.collected) return item;
            let nx = item.x + item.vx;
            let ny = item.y + item.vy;
            let nvx = item.vx;
            let nvy = item.vy;
            // Bounce off walls
            if (nx < 5 || nx > 95) {
              nvx = -nvx;
              nx = Math.max(5, Math.min(95, nx));
            }
            if (ny < 10 || ny > 85) {
              nvy = -nvy;
              ny = Math.max(10, Math.min(85, ny));
            }
            return { ...item, x: nx, y: ny, vx: nvx, vy: nvy };
          })
          .filter((item) => !item.collected),
      );
      animFrame.current = requestAnimationFrame(move);
    };
    animFrame.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animFrame.current);
  }, [phase]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'play') return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 0.1) {
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // Check completion when all correct ingredients collected
  useEffect(() => {
    if (collected.length >= TARGET_CORRECT && phase === 'play' && !completedRef.current) {
      completedRef.current = true;
      setPhase('feedback');
      sfxPerfect();
      const speedBonus = Math.round(timer * 20);
      const finalScore = roundScoreRef.current + SCORE.PERFECT_BONUS + speedBonus;
      roundScoreRef.current = finalScore;
      setRoundScore(finalScore);
      addPopup('PERFECT RECIPE!', '#d4af37', window.innerWidth / 2 - 60, window.innerHeight / 2 - 50);
      setTimeout(() => {
        sfxComplete();
        setShowComplete(true);
        setTimeout(() => onComplete(finalScore, 10), 1200);
      }, 1500);
    }
  }, [collected, phase, timer, onComplete, addPopup]);

  // Handle timeout
  useEffect(() => {
    if (timer <= 0 && phase === 'play' && !completedRef.current) {
      completedRef.current = true;
      setPhase('feedback');
      const harmonyDelta = collectedRef.current.length >= 3 ? 5 : -5;
      const finalScore = roundScoreRef.current;
      setShowComplete(true);
      setTimeout(() => {
        onComplete(finalScore, harmonyDelta);
      }, 1200);
    }
  }, [timer, phase, onComplete]);

  const handleItemClick = (item: FloatingItem, e: React.PointerEvent) => {
    if (phase !== 'play' || item.collected) return;
    e.stopPropagation();

    if (item.correct) {
      // Check if already collected
      if (collected.includes(item.name)) {
        sfxMistake();
        setCombo(0);
        setRoundScore((s) => Math.max(0, s + SCORE.MISTAKE));
        addPopup('Already have it!', '#9b3a4a', e.clientX, e.clientY);
        return;
      }
      // Correct ingredient
      const newCollected = [...collected, item.name];
      setCollected(newCollected);
      sfxCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = SCORE.CORRECT + Math.min(newCombo * 15, 75);
      setRoundScore((s) => s + points);
      if (newCombo >= 3) sfxCombo();
      addPopup(`+${points}`, '#5ba35b', e.clientX, e.clientY);
      // Mark item as collected so it disappears
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, collected: true } : i)));
    } else {
      // Wrong ingredient
      sfxMistake();
      setCombo(0);
      setRoundScore((s) => Math.max(0, s + SCORE.MISTAKE));
      addPopup(`${SCORE.MISTAKE}`, '#9b3a4a', e.clientX, e.clientY);
    }
  };

  return (
    <div className="min-h-screen game-screen flex flex-col items-center pt-20 pb-16 px-4 stage-enter">
      <StageIntro stage="MODAK" />
      {showComplete && <StageComplete stage="MODAK" />}
      <HUD
        stage="MODAK"
        score={score + roundScore}
        harmony={harmony}
        stageIndex={stageIndex}
        totalStages={totalStages}
        timer={timer}
        instruction="Tap the correct ingredients! Avoid the wrong ones."
        muted={muted}
        onToggleMute={onToggleMute}
      />

      {/* Score popups */}
      {popups.map((p) => (
        <div
          key={p.id}
          className="fixed z-50 pointer-events-none font-display font-bold text-xl animate-floatUp"
          style={{ left: p.x, top: p.y, color: p.color }}
        >
          {p.text}
        </div>
      ))}

      {/* Recipe tracker */}
      <div className="w-full max-w-md mb-3">
        <div className="glass-card rounded-xl p-3 shadow-soft">
          <p className="text-center text-xs font-body font-bold text-maroon-600 mb-2">
            Modak Recipe — Collect all 5 ingredients
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {MODAK_INGREDIENTS.map((ing) => {
              const has = collected.includes(ing.name);
              return (
                <div
                  key={ing.id}
                  className={`flex flex-col items-center transition-all ${
                    has ? 'opacity-100 scale-110' : 'opacity-40 scale-95'
                  }`}
                >
                  <span className="text-2xl">{ing.emoji}</span>
                  <span className={`text-[10px] font-body ${has ? 'text-eco-600 font-bold' : 'text-maroon-400'}`}>
                    {has ? '✓' : ing.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Play area */}
      <div
        ref={playAreaRef}
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-cream-100 to-cream-200 shadow-card overflow-hidden no-select"
        style={{ height: 'min(55vh, 400px)' }}
      >
        {/* Decorative modak target in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <div className="text-8xl">🪔</div>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Collection burst ring */}
            {item.collected && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-eco-400 animate-ringPulse pointer-events-none"
              />
            )}
            <button
              onPointerDown={(e) => handleItemClick(item, e)}
              className={`transition-all duration-300 ${
                item.collected ? 'scale-0 opacity-0' : 'hover:scale-110'
              }`}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-card btn-press ${
                  item.correct
                    ? 'bg-cream-50 border-2 border-eco-400 shadow-glow'
                    : 'bg-cream-50 border-2 border-blush-300'
              }`}
              >
                {item.emoji}
              </div>
            </button>
          </div>
        ))}

        {/* Combo display */}
        {combo >= 2 && (
          <div className="absolute top-2 right-2 font-display font-bold text-saffron-500 text-lg animate-popBounce">
            COMBO x{combo}!
          </div>
        )}
      </div>

      {/* Modak progress visual — builds a modak shape */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-body text-maroon-500">Modak progress:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: TARGET_CORRECT }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  i < collected.length ? 'bg-saffron-400 shadow-glow scale-110' : 'bg-cream-300'
                }`}
              />
            ))}
          </div>
        </div>
        {/* Completed modak visual payoff */}
        {phase === 'feedback' && collected.length >= TARGET_CORRECT && (
          <div className="flex flex-col items-center animate-popBounce">
            <div className="text-6xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 159, 28, 0.4))' }}>
              🥮
            </div>
            <span className="font-display font-bold text-lg text-saffron-500 mt-1">Perfect Modak!</span>
          </div>
        )}
      </div>
    </div>
  );
}
