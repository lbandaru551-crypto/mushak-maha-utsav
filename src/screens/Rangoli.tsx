// ============================================================
// RANGOLI MEMORY — Mini-game 1
// A pattern is shown briefly, then hidden. The player must
// recreate it by tapping tiles. 4 rounds of increasing difficulty.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import HUD from '@/components/HUD';
import StageIntro from '@/components/StageIntro';
import StageComplete from '@/components/StageComplete';
import { RANGOLI_COLORS, SCORE, shuffle } from '@/game/constants';
import type { ScorePopup } from '@/game/types';
import { sfxCorrect, sfxMistake, sfxPerfect, sfxComplete } from '@/game/audio';

interface RangoliProps {
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  muted: boolean;
  onToggleMute: () => void;
  onComplete: (stageScore: number, harmonyDelta: number) => void;
}

// Round configs: grid size + number of colors + number of filled cells
const ROUNDS = [
  { gridSize: 3, numColors: 3, filled: 4, showTime: 1400 },
  { gridSize: 3, numColors: 4, filled: 5, showTime: 1500 },
  { gridSize: 4, numColors: 4, filled: 6, showTime: 1600 },
  { gridSize: 4, numColors: 5, filled: 8, showTime: 1800 },
];

interface Pattern {
  cellIndex: number;
  color: string;
}

export default function Rangoli({
  score,
  harmony,
  stageIndex,
  totalStages,
  muted,
  onToggleMute,
  onComplete,
}: RangoliProps) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'show' | 'play' | 'feedback'>('show');
  const [pattern, setPattern] = useState<Pattern[]>([]);
  const [playerPattern, setPlayerPattern] = useState<Pattern[]>([]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [combo, setCombo] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const popupId = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundScoreRef = useRef(0);

  const config = ROUNDS[round];
  const totalCells = config.gridSize * config.gridSize;

  // Generate a new pattern for the current round
  const generatePattern = useCallback(() => {
    const colors = RANGOLI_COLORS.slice(0, config.numColors);
    const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i)).slice(0, config.filled);
    const newPattern: Pattern[] = indices.map((cellIndex) => ({
      cellIndex,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPattern(newPattern);
    setPlayerPattern([]);
    setPhase('show');
  }, [config, totalCells]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  // Auto-hide the pattern after showTime
  useEffect(() => {
    if (phase === 'show') {
      timerRef.current = setTimeout(() => setPhase('play'), config.showTime);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [phase, config.showTime]);

  const addPopup = useCallback((text: string, color: string) => {
    const id = popupId.current++;
    setPopups((prev) => [
      ...prev,
      { id, text, x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 50, color },
    ]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 2500);
  }, []);

  // Keep ref in sync so setTimeout callbacks read the latest score
  useEffect(() => {
    roundScoreRef.current = roundScore;
  }, [roundScore]);

  const handleTileClick = (cellIndex: number, color: string) => {
    if (phase !== 'play') return;

    // Check if this cell is in the pattern
    const expected = pattern.find((p) => p.cellIndex === cellIndex);
    const alreadyPlaced = playerPattern.find((p) => p.cellIndex === cellIndex);

    if (alreadyPlaced) return; // Can't tap same tile twice

    if (expected && expected.color === color) {
      // Correct! Add to player pattern
      const newPlayer = [...playerPattern, { cellIndex, color }];
      setPlayerPattern(newPlayer);
      sfxCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = SCORE.CORRECT + Math.min(newCombo * 10, 50);
      // Update both state and ref synchronously so the ref is never stale
      const newScore = roundScoreRef.current + points;
      roundScoreRef.current = newScore;
      setRoundScore(newScore);
      addPopup(`+${points}`, '#5ba35b');

      // Check if round complete
      if (newPlayer.length === pattern.length) {
        const allCorrect = newPlayer.every((p) => {
          const exp = pattern.find((e) => e.cellIndex === p.cellIndex);
          return exp && exp.color === p.color;
        });
        if (allCorrect) {
          setPhase('feedback');
          setFeedback('correct');
          sfxPerfect();
          addPopup('PERFECT! +250', '#d4af37');
          const scoreWithBonus = roundScoreRef.current + SCORE.PERFECT_BONUS;
          roundScoreRef.current = scoreWithBonus;
          setRoundScore(scoreWithBonus);

          setTimeout(() => {
            if (round < ROUNDS.length - 1) {
              setRound((r) => r + 1);
              setFeedback(null);
              setCombo(0);
            } else {
              sfxComplete();
              setShowComplete(true);
              setTimeout(() => onComplete(scoreWithBonus, 8), 1200);
            }
          }, 1200);
        }
      }
    } else {
      // Wrong tile or wrong color
      sfxMistake();
      setCombo(0);
      const newScore = Math.max(0, roundScoreRef.current + SCORE.MISTAKE);
      roundScoreRef.current = newScore;
      setRoundScore(newScore);
      addPopup(`${SCORE.MISTAKE}`, '#9b3a4a');
      setFeedback('wrong');
      setWrongCell(cellIndex);
      setTimeout(() => { setFeedback(null); setWrongCell(null); }, 400);
    }
  };

  // The color the player should use for the next tap
  // We cycle through available colors for the current round
  const availableColors = RANGOLI_COLORS.slice(0, config.numColors);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    setSelectedColor(0);
  }, [round]);

  return (
    <div className="min-h-screen game-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 rangoli-bg stage-enter">
      <StageIntro stage="RANGOLI" />
      {showComplete && <StageComplete stage="RANGOLI" />}
      <HUD
        stage="RANGOLI"
        score={score + roundScore}
        harmony={harmony}
        stageIndex={stageIndex}
        totalStages={totalStages}
        instruction={
          phase === 'show'
            ? 'Memorize the pattern — it will disappear soon!'
            : phase === 'play'
              ? 'Pick a color, then tap the matching tiles to recreate the pattern'
              : 'Perfect! Get ready for the next round...'
        }
        muted={muted}
        onToggleMute={onToggleMute}
      />

      {/* Score popups */}
      {popups.map((p) => (
        <div
          key={p.id}
          className="fixed z-50 pointer-events-none font-display font-bold text-2xl animate-floatUp"
          style={{ left: p.x, top: p.y, color: p.color }}
        >
          {p.text}
        </div>
      ))}

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Round indicator */}
        <div className="flex gap-2 mb-4">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full transition-colors ${
                i < round ? 'bg-eco-500' : i === round ? 'bg-saffron-500' : 'bg-cream-300'
              }`}
            />
          ))}
        </div>

        <p className="font-body text-sm font-bold text-maroon-600 mb-3">
          {phase === 'show'
            ? `Round ${round + 1} of ${ROUNDS.length} — Watch carefully!`
            : phase === 'play'
              ? `Round ${round + 1} of ${ROUNDS.length} — Recreate the pattern`
              : 'Beautiful!'}
        </p>

        {/* Color selector — only visible during play phase */}
        {phase === 'play' && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-body text-maroon-500 mr-1">Color:</span>
            {availableColors.map((color, i) => (
              <button
                key={color}
                onClick={() => setSelectedColor(i)}
                className={`w-11 h-11 rounded-full btn-press transition-all ${
                  selectedColor === i ? 'ring-4 ring-offset-2 ring-maroon-400 scale-110 shadow-glow' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ background: color }}
                aria-label={`Select color ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Rangoli grid */}
        <div
          className={`relative grid gap-1.5 p-3 sm:p-4 rounded-3xl bg-cream-100 shadow-card transition-all ${
            feedback === 'wrong' ? 'animate-shake' : feedback === 'correct' ? 'animate-glowPulse' : ''
          }`}
          style={{
            gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
            width: 'min(80vw, 320px)',
            aspectRatio: '1',
          }}
        >
          {/* Decorative center dot */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gold-400/20 transition-all ${
              feedback === 'correct' ? 'bg-gold-400/50 scale-150 animate-glowPulse' : ''
            }`}
          />

          {/* Petal celebration on final completion */}
          {feedback === 'correct' && round === ROUNDS.length - 1 && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      animation: `petalBurst 1s ease-out ${i * 0.05}s forwards`,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: ['#F0A8C3', '#FFB13D', '#E8C97A', '#5BA35B'][i % 4],
                        borderRadius: '50% 0 50% 50%',
                        opacity: 0.7,
                        transform: 'rotate(45deg)',
                        ['--tx' as string]: `${Math.cos(angle) * 80}px`,
                        ['--ty' as string]: `${Math.sin(angle) * 80}px`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {Array.from({ length: totalCells }).map((_, cellIndex) => {
            const patternCell = pattern.find((p) => p.cellIndex === cellIndex);
            const playerCell = playerPattern.find((p) => p.cellIndex === cellIndex);
            const showColor = phase === 'show' ? patternCell?.color : playerCell?.color;

            return (
              <button
                key={cellIndex}
                onClick={() => phase === 'play' && handleTileClick(cellIndex, availableColors[selectedColor])}
                disabled={phase !== 'play'}
                className={`rounded-xl transition-all duration-200 btn-press relative ${
                  wrongCell === cellIndex
                    ? 'bg-maroon-400/30 animate-shake'
                    : phase === 'show' && showColor
                      ? 'shadow-glow scale-105'
                      : phase === 'play' && !showColor
                        ? 'bg-cream-200 hover:bg-cream-300 ring-1 ring-inset ring-cream-300'
                        : showColor
                          ? 'shadow-soft animate-tilePop'
                          : 'bg-cream-200'
                }`}
                style={{
                  background: showColor ?? undefined,
                  aspectRatio: '1',
                }}
              >
                {showColor && (
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: showColor,
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Combo display */}
        {combo > 1 && phase === 'play' && (
          <div className="mt-4 font-display font-bold text-saffron-500 text-lg animate-popBounce">
            COMBO x{combo}!
          </div>
        )}
      </div>
    </div>
  );
}
