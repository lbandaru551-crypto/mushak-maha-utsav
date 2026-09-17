// ============================================================
// ECO-FRIENDLY FESTIVAL — Mini-game 5
// A decision challenge: pick the eco-friendly option from each pair.
// Correct: +100. Perfect sequence: +500 ECO BONUS.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import HUD from '@/components/HUD';
import StageIntro from '@/components/StageIntro';
import StageComplete from '@/components/StageComplete';
import { ECO_PAIRS, SCORE, shuffle } from '@/game/constants';
import type { ScorePopup } from '@/game/types';
import { sfxEco, sfxMistake, sfxPerfect, sfxComplete } from '@/game/audio';

interface EcoProps {
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  muted: boolean;
  onToggleMute: () => void;
  onComplete: (stageScore: number, harmonyDelta: number) => void;
}

export default function Eco({
  score,
  harmony,
  stageIndex,
  totalStages,
  muted,
  onToggleMute,
  onComplete,
}: EcoProps) {
  const [pairs, setPairs] = useState(() => shuffle(ECO_PAIRS));
  const [currentPair, setCurrentPair] = useState(0);
  const [choices, setChoices] = useState<boolean[]>([]);
  const [roundScore, setRoundScore] = useState(0);
  const [phase, setPhase] = useState<'play' | 'feedback'>('play');
  const [showComplete, setShowComplete] = useState(false);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const roundScoreRef = useRef(0);
  const choicesRef = useRef<boolean[]>([]);

  useEffect(() => {
    roundScoreRef.current = roundScore;
  }, [roundScore]);
  useEffect(() => {
    choicesRef.current = choices;
  }, [choices]);

  const addPopup = useCallback((text: string, color: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 2000);
  }, []);

  const pair = pairs[currentPair];
  const options = pair ? shuffle([pair.eco, pair.bad]) : [];

  const handleChoice = (isEco: boolean, e: React.PointerEvent) => {
    if (phase !== 'play' || showResult) return;

    if (isEco) {
      sfxEco();
      setRoundScore((s) => s + SCORE.CORRECT);
      setChoices((c) => [...c, true]);
      setShowResult('correct');
      addPopup(`+${SCORE.CORRECT}`, '#5ba35b', e.clientX, e.clientY);
    } else {
      sfxMistake();
      setRoundScore((s) => Math.max(0, s + SCORE.MISTAKE));
      setChoices((c) => [...c, false]);
      setShowResult('wrong');
      addPopup(`${SCORE.MISTAKE}`, '#9b3a4a', e.clientX, e.clientY);
    }

    setTimeout(() => {
      setShowResult(null);
      if (currentPair < pairs.length - 1) {
        setCurrentPair((p) => p + 1);
      } else {
        // All choices made — use refs to read latest values
        setPhase('feedback');
        const allChoices = [...choicesRef.current, isEco];
        const perfect = allChoices.every((c) => c);

        const ecoBonus = perfect ? SCORE.ECO_BONUS : 0;
        const finalScore = Math.max(0, roundScoreRef.current + ecoBonus);
        const correctCount = allChoices.filter((c) => c).length;

        if (perfect) {
          sfxPerfect();
          setRoundScore(finalScore);
          addPopup('ECO BONUS! +500', '#5ba35b', window.innerWidth / 2 - 80, window.innerHeight / 2 - 50);
        }

        setTimeout(() => {
          sfxComplete();
          setShowComplete(true);
          setTimeout(() => onComplete(finalScore, correctCount === pairs.length ? 10 : correctCount >= 3 ? 5 : 0), 1200);
        }, 1800);
      }
    }, 800);
  };

  if (!pair) return null;

  return (
    <div className="min-h-screen game-screen flex flex-col items-center pt-20 pb-16 px-4 stage-enter">
      <StageIntro stage="ECO" />
      {showComplete && <StageComplete stage="ECO" />}
      <HUD
        stage="ECO"
        score={score + roundScore}
        harmony={harmony}
        stageIndex={stageIndex}
        totalStages={totalStages}
        instruction="Choose the eco-friendly option for a greener festival"
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

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Progress */}
        <div className="flex gap-2 mb-4">
          {pairs.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-2 rounded-full transition-colors ${
                i < currentPair
                  ? choices[i]
                    ? 'bg-eco-500'
                    : 'bg-maroon-400'
                  : i === currentPair
                    ? 'bg-saffron-500'
                    : 'bg-cream-300'
              }`}
            />
          ))}
        </div>

        <p className="font-body text-sm font-bold text-maroon-600 mb-1">
          Question {currentPair + 1} of {pairs.length}
        </p>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-maroon-700 text-center mb-6">
          Which is the eco-friendly choice?
        </h2>

        {/* Two options */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((option) => {
            const isEco = option.id === pair.eco.id;
            const showCorrect = showResult === 'correct' && isEco;
            const showWrong = showResult === 'wrong' && !isEco;

            return (
              <button
                key={option.id}
                onPointerDown={(e) => handleChoice(isEco, e)}
                disabled={phase !== 'play' || !!showResult}
                className={`glass-card rounded-2xl p-5 sm:p-6 shadow-card flex flex-col items-center gap-3 btn-press transition-all ${
                  showCorrect
                    ? 'ring-4 ring-eco-500 scale-105 bg-eco-300/20 animate-glowPulse'
                    : showWrong
                      ? 'ring-4 ring-maroon-400 scale-105 bg-maroon-400/10 animate-shake'
                      : 'hover:scale-105 hover:shadow-glow'
                }`}
                aria-label={`Choose ${option.name}`}
              >
                <div className={`text-5xl sm:text-6xl transition-transform ${showCorrect || showWrong ? 'scale-110' : ''}`}>
                  {option.emoji}
                </div>
                <span className="font-body font-bold text-sm text-maroon-700 text-center">
                  {option.name}
                </span>
                {showCorrect && (
                  <span className="text-eco-600 font-body font-bold text-xs animate-popBounce flex items-center gap-1">
                    ✓ ECO-FRIENDLY
                  </span>
                )}
                {showWrong && (
                  <span className="text-maroon-400 font-body font-bold text-xs animate-popBounce flex items-center gap-1">
                    ✗ NOT ECO-FRIENDLY
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Eco tip */}
        <div className="mt-6 glass-card rounded-xl p-3 px-4 text-center max-w-xs">
          <p className="font-body text-xs text-maroon-500">
            🌱 Eco-friendly festivals protect our rivers and nature while keeping traditions alive.
          </p>
        </div>
      </div>
    </div>
  );
}
