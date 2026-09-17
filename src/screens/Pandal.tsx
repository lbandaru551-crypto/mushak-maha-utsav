// ============================================================
// PANDAL DECORATION — Mini-game 3
// The player taps decoration items, then taps target zones to place them.
// Each zone has a preferred decoration type. Snap-to-position on placement.
// Visually impressive for the demo video.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import HUD from '@/components/HUD';
import StageIntro from '@/components/StageIntro';
import StageComplete from '@/components/StageComplete';
import { SCORE, shuffle } from '@/game/constants';
import type { ScorePopup } from '@/game/types';
import { sfxCorrect, sfxMistake, sfxPerfect, sfxComplete } from '@/game/audio';

interface PandalProps {
  score: number;
  harmony: number;
  stageIndex: number;
  totalStages: number;
  muted: boolean;
  onToggleMute: () => void;
  onComplete: (stageScore: number, harmonyDelta: number) => void;
}

// Decoration types and their target zones
const DECORATIONS = [
  { id: 'flower', emoji: '🌸', name: 'Flower', targetZone: 'top' },
  { id: 'diya', emoji: '🪔', name: 'Diya', targetZone: 'sides' },
  { id: 'leaf', emoji: '🍃', name: 'Leaf', targetZone: 'corners' },
  { id: 'banner', emoji: '🎏', name: 'Banner', targetZone: 'top' },
  { id: 'lamp', emoji: '🏮', name: 'Lamp', targetZone: 'sides' },
  { id: 'rangoli', emoji: '🌀', name: 'Rangoli', targetZone: 'center' },
];

// Zones on the pandal — non-overlapping for clear placement
const ZONES = [
  { id: 'top', name: 'Top Arch', x: 50, y: 12, w: 70, h: 18 },
  { id: 'sides', name: 'Side Pillars', x: 50, y: 42, w: 95, h: 28 },
  { id: 'corners', name: 'Base', x: 50, y: 75, w: 85, h: 18 },
  { id: 'center', name: 'Center Stage', x: 50, y: 42, w: 28, h: 22 },
];

const TOTAL_PLACEMENTS = 6; // one per decoration

export default function Pandal({
  score,
  harmony,
  stageIndex,
  totalStages,
  muted,
  onToggleMute,
  onComplete,
}: PandalProps) {
  const [selectedDecor, setSelectedDecor] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, { decorId: string; emoji: string; correct: boolean }>>({});
  const [placedCount, setPlacedCount] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [phase, setPhase] = useState<'play' | 'feedback'>('play');
  const [showComplete, setShowComplete] = useState(false);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [highlightZone, setHighlightZone] = useState<string | null>(null);
  const [placementRipple, setPlacementRipple] = useState<string | null>(null);
  const [availableDecorations, setAvailableDecorations] = useState(DECORATIONS);
  const [startTime] = useState(Date.now());
  const roundScoreRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => { roundScoreRef.current = roundScore; }, [roundScore]);

  const addPopup = useCallback((text: string, color: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 2000);
  }, []);

  // Shuffle decorations on mount for replayability
  useEffect(() => {
    setAvailableDecorations(shuffle(DECORATIONS));
  }, []);

  // Check completion
  useEffect(() => {
    if (placedCount >= TOTAL_PLACEMENTS && phase === 'play' && !completedRef.current) {
      completedRef.current = true;
      setPhase('feedback');
      const correctCount = Object.values(placements).filter((p) => p.correct).length;
      const allCorrect = correctCount === TOTAL_PLACEMENTS;
      const elapsed = (Date.now() - startTime) / 1000;
      const speedBonus = Math.max(0, Math.round(SCORE.SPEED_MAX - elapsed * 5));
      const perfectBonus = allCorrect ? SCORE.PERFECT_BONUS : 0;
      const finalScore = roundScoreRef.current + speedBonus + perfectBonus;
      roundScoreRef.current = finalScore;
      setRoundScore(finalScore);

      if (allCorrect) {
        sfxPerfect();
        addPopup('PERFECT DECORATION!', '#d4af37', window.innerWidth / 2 - 80, window.innerHeight / 2 - 50);
      }

      setTimeout(() => {
        sfxComplete();
        setShowComplete(true);
        setTimeout(() => onComplete(finalScore, allCorrect ? 10 : correctCount >= 4 ? 5 : 0), 1200);
      }, 2000);
    }
  }, [placedCount, phase, placements, startTime, onComplete, addPopup]);

  const handleSelectDecor = (decorId: string) => {
    if (phase !== 'play') return;
    if (placements[decorId]) return; // already placed
    setSelectedDecor(decorId);
    // Highlight the correct zone briefly
    const decor = DECORATIONS.find((d) => d.id === decorId);
    if (decor) {
      setHighlightZone(decor.targetZone);
      setTimeout(() => setHighlightZone(null), 1000);
    }
  };

  const handleZoneClick = (zoneId: string, e: React.PointerEvent) => {
    if (phase !== 'play' || !selectedDecor) return;
    const decor = DECORATIONS.find((d) => d.id === selectedDecor);
    if (!decor) return;

    const isCorrect = decor.targetZone === zoneId;
    const newPlacements = {
      ...placements,
      [selectedDecor]: { decorId: selectedDecor, emoji: decor.emoji, correct: isCorrect },
    };
    setPlacements(newPlacements);
    setPlacedCount((c) => c + 1);

    if (isCorrect) {
      sfxCorrect();
      setRoundScore((s) => s + SCORE.CORRECT);
      addPopup(`+${SCORE.CORRECT}`, '#5ba35b', e.clientX, e.clientY);
    } else {
      sfxMistake();
      setRoundScore((s) => Math.max(0, s + SCORE.MISTAKE));
      addPopup(`${SCORE.MISTAKE}`, '#9b3a4a', e.clientX, e.clientY);
    }
    setPlacementRipple(zoneId);
    setTimeout(() => setPlacementRipple(null), 500);
    setSelectedDecor(null);
  };

  return (
    <div className="min-h-screen game-screen flex flex-col items-center pt-20 pb-16 px-4 stage-enter">
      <StageIntro stage="PANDAL" />
      {showComplete && <StageComplete stage="PANDAL" />}
      <HUD
        stage="PANDAL"
        score={score + roundScore}
        harmony={harmony}
        stageIndex={stageIndex}
        totalStages={totalStages}
        instruction={
          selectedDecor
            ? `Place the ${DECORATIONS.find((d) => d.id === selectedDecor)?.name} — tap the matching zone`
            : 'Select a decoration below, then tap a zone in the pandal to place it'
        }
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

      <div className="w-full max-w-md">
        <p className="text-center text-sm font-body font-bold text-maroon-600 mb-2">
          Decorate the Pandal — Place each item in its matching zone
        </p>

        {/* Pandal area */}
        <div
          className={`relative rounded-3xl shadow-card overflow-hidden no-select mb-4 transition-all duration-700 ${
            phase === 'feedback' ? 'shadow-glow ring-2 ring-gold-400/40' : ''
          }`}
          style={{
            height: 'min(45vh, 340px)',
            background: phase === 'feedback'
              ? 'linear-gradient(180deg, #FFF7E8 0%, #FBEFD4 40%, #F4E1B8 80%, #E8C97A 100%)'
              : 'linear-gradient(180deg, #FFF7E8 0%, #FBEFD4 50%, #F4E1B8 100%)',
          }}
        >
          {/* Warm glow overlay when complete */}
          {phase === 'feedback' && (
            <div
              className="absolute inset-0 pointer-events-none animate-fadeIn"
              style={{
                background: 'radial-gradient(ellipse at 50% 45%, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
              }}
            />
          )}

          {/* Decorative arch at top */}
          <svg className="absolute top-0 left-0 w-full" viewBox="0 0 200 40" style={{ height: '40px' }}>
            <path d="M 0 40 Q 100 -20 200 40" fill="#9B3A4A" opacity={phase === 'feedback' ? '0.25' : '0.15'} className="transition-opacity duration-700" />
            <path d="M 20 40 Q 100 0 180 40" fill="#D4AF37" opacity={phase === 'feedback' ? '0.35' : '0.2'} className="transition-opacity duration-700" />
          </svg>

          {/* Zones */}
          {ZONES.map((zone) => {
            const itemsInZone = Object.entries(placements).filter(([, p]) => {
              const decor = DECORATIONS.find((d) => d.id === p.decorId);
              return decor?.targetZone === zone.id;
            });

            return (
              <button
                key={zone.id}
                onPointerDown={(e) => handleZoneClick(zone.id, e)}
                disabled={!selectedDecor || phase !== 'play'}
                className={`absolute rounded-2xl border-2 border-dashed transition-all flex items-center justify-center flex-wrap gap-1 ${
                  selectedDecor && phase === 'play'
                    ? highlightZone === zone.id
                      ? 'border-saffron-500 bg-saffron-300/30 animate-pulse scale-105'
                      : 'border-maroon-400/50 bg-cream-100/60 hover:bg-cream-200/60'
                    : phase === 'play'
                      ? 'border-maroon-400/15 bg-cream-100/20'
                      : 'border-transparent bg-transparent'
                }`}
                style={{
                  left: `${zone.x - zone.w / 2}%`,
                  top: `${zone.y - zone.h / 2}%`,
                  width: `${zone.w}%`,
                  height: `${zone.h}%`,
                }}
              >
                {/* Placement ripple effect */}
                {placementRipple === zone.id && (
                  <div className="absolute inset-0 rounded-2xl bg-saffron-300/40 animate-ringPulse pointer-events-none" />
                )}
                {/* Show placed items */}
                {Object.entries(placements)
                  .filter(([, p]) => {
                    const decor = DECORATIONS.find((d) => d.id === p.decorId);
                    return decor?.targetZone === zone.id;
                  })
                  .map(([decorId, p]) => (
                    <span
                      key={decorId}
                      className="text-2xl sm:text-3xl animate-slotFill"
                      style={{ filter: p.correct ? 'none' : 'grayscale(0.5)' }}
                    >
                      {p.emoji}
                    </span>
                  ))}
                {/* Show zone label — always visible during play when empty */}
                {phase === 'play' && itemsInZone.length === 0 && (
                  <span className={`text-[10px] sm:text-xs font-body uppercase tracking-wide ${
                    selectedDecor ? 'text-maroon-600 font-bold' : 'text-maroon-400/60'
                  }`}>
                    {zone.name}
                  </span>
                )}
              </button>
            );
          })}

          {/* Central Ganesha placeholder (decorative, non-interactive) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none ${
            phase === 'feedback' ? 'opacity-60 text-5xl animate-glowPulse' : 'opacity-20 text-4xl'
          }`}>
            🕉️
          </div>
        </div>

        {/* Decoration palette */}
        <div className="glass-card rounded-2xl p-3 shadow-soft">
          <p className="text-center text-xs font-body font-bold text-maroon-600 mb-2">
            Tap a decoration to select, then tap a zone
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {availableDecorations.map((decor) => {
              const placed = placements[decor.id];
              return (
                <button
                  key={decor.id}
                  onClick={() => handleSelectDecor(decor.id)}
                  disabled={!!placed || phase !== 'play'}
                  className={`flex flex-col items-center transition-all btn-press ${
                    placed
                      ? 'opacity-30'
                      : selectedDecor === decor.id
                        ? 'scale-110 ring-2 ring-saffron-500 rounded-xl'
                        : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-soft ${
                      selectedDecor === decor.id ? 'bg-saffron-300/30' : 'bg-cream-50'
                    }`}
                  >
                    {decor.emoji}
                  </div>
                  <span className="text-[10px] font-body text-maroon-500 mt-1">{decor.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-sm font-body text-maroon-500">Placed:</span>
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_PLACEMENTS }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-colors ${
                  i < placedCount ? 'bg-saffron-400' : 'bg-cream-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
