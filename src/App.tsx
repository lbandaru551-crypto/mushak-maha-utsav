// ============================================================
// APP — Central game state machine.
// Manages transitions between all screens, tracks global score,
// harmony, and per-stage scores. Handles localStorage persistence.
// ============================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameStage, StageScore, RunResult } from '@/game/types';
import { STAGE_ORDER, getHarmonyTier, SCORE } from '@/game/constants';
import {
  getBestScore,
  setBestScore,
  setLastRun,
  addRunToHistory,
  getMuted,
  setMuted as persistMute,
} from '@/game/storage';
import { setMuted as setAudioMuted, initAudio } from '@/game/audio';

import Menu from '@/screens/Menu';
import Tutorial from '@/screens/Tutorial';
import Rangoli from '@/screens/Rangoli';
import Modak from '@/screens/Modak';
import Pandal from '@/screens/Pandal';
import Dhol from '@/screens/Dhol';
import Eco from '@/screens/Eco';
import Aarti from '@/screens/Aarti';
import Result from '@/screens/Result';
import Leaderboard from '@/screens/Leaderboard';

export default function App() {
  // --- Core game state ---
  const [stage, setStage] = useState<GameStage>('MENU');
  const [score, setScore] = useState(0);
  const [harmony, setHarmony] = useState(70); // start at a neutral level
  const [stageScores, setStageScores] = useState<StageScore[]>([]);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [runStartTime, setRunStartTime] = useState(0);
  const [lastRun, setLastRunState] = useState<RunResult | null>(null);
  const [muted, setMutedState] = useState(false);

  // Load mute preference on mount
  useEffect(() => {
    const m = getMuted();
    setMutedState(m);
    setAudioMuted(m);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      persistMute(next);
      setAudioMuted(next);
      if (!next) initAudio();
      return next;
    });
  }, []);

  // --- Start a new run ---
  const startGame = useCallback(() => {
    setScore(0);
    setHarmony(70);
    setStageScores([]);
    setSpeedBonus(0);
    setRunStartTime(Date.now());
    setStage('RANGOLI');
  }, []);

  // Ref to always read the latest stageScores length without re-creating the callback
  const stageScoresLenRef = useRef(0);
  useEffect(() => { stageScoresLenRef.current = stageScores.length; }, [stageScores.length]);

  // --- Generic stage completion handler ---
  // Each mini-game calls this with its score and harmony delta.
  // Uses a ref for stageScores.length so the callback never goes stale.
  const handleStageComplete = useCallback(
    (stageScore: number, harmonyDelta: number) => {
      setScore((prev) => prev + stageScore);
      setHarmony((prev) => Math.max(0, Math.min(100, prev + harmonyDelta)));

      // Read the current count from the ref — always up to date
      const currentIndex = stageScoresLenRef.current;
      const stageName = STAGE_ORDER[currentIndex] ?? 'Unknown';

      // Record the stage score
      setStageScores((prev) => [...prev, { name: stageName, score: stageScore }]);

      // Advance to the next stage (or Aarti if all done)
      const nextIndex = currentIndex + 1;
      if (nextIndex < STAGE_ORDER.length) {
        setStage(STAGE_ORDER[nextIndex]);
      } else {
        setStage('AARTI');
      }
    },
    [],
  );

  // --- Aarti completion → Results ---
  const handleAartiComplete = useCallback(() => {
    // Calculate speed bonus based on total run time
    const elapsed = (Date.now() - runStartTime) / 1000;
    const bonus = Math.max(0, Math.round(SCORE.SPEED_MAX - elapsed * 0.5));
    // Aarti bonus based on harmony
    const aartiBonus = Math.round((harmony / 100) * SCORE.AARTI_MAX_BONUS);

    setSpeedBonus(bonus + aartiBonus);
    setStage('RESULT');
  }, [runStartTime, harmony]);

  // --- Results → persist score ---
  // We use an effect to save once the result stage is entered
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (stage === 'RESULT' && !saved) {
      setSaved(true);
      const totalWithBonus = score + speedBonus;
      const prevBest = getBestScore();
      const isNewBest = totalWithBonus > prevBest;
      if (isNewBest) {
        setBestScore(totalWithBonus);
      }
      const run: RunResult = {
        total: totalWithBonus,
        harmony,
        rank: getHarmonyTier(harmony).label,
        stages: stageScores,
        date: Date.now(),
        isNewBest,
      };
      setLastRun(run);
      setLastRunState(run);
      addRunToHistory(run);
    }
  }, [stage, saved, score, speedBonus, harmony, stageScores]);

  // Reset saved flag when starting a new game
  useEffect(() => {
    if (stage === 'RANGOLI') {
      setSaved(false);
    }
  }, [stage]);

  // --- Navigation handlers ---
  const goToMenu = useCallback(() => setStage('MENU'), []);
  const goToTutorial = useCallback(() => setStage('TUTORIAL'), []);
  const goToLeaderboard = useCallback(() => setStage('LEADERBOARD'), []);

  const currentStageIndex = STAGE_ORDER.indexOf(stage);

  // --- Render the appropriate screen ---
  switch (stage) {
    case 'MENU':
      return (
        <Menu
          onStart={startGame}
          onTutorial={goToTutorial}
          onLeaderboard={goToLeaderboard}
          muted={muted}
          onToggleMute={handleToggleMute}
        />
      );

    case 'TUTORIAL':
      return <Tutorial onBegin={startGame} onBack={goToMenu} />;

    case 'RANGOLI':
      return (
        <Rangoli
          score={score}
          harmony={harmony}
          stageIndex={currentStageIndex}
          totalStages={STAGE_ORDER.length}
          muted={muted}
          onToggleMute={handleToggleMute}
          onComplete={handleStageComplete}
        />
      );

    case 'MODAK':
      return (
        <Modak
          score={score}
          harmony={harmony}
          stageIndex={currentStageIndex}
          totalStages={STAGE_ORDER.length}
          muted={muted}
          onToggleMute={handleToggleMute}
          onComplete={handleStageComplete}
        />
      );

    case 'PANDAL':
      return (
        <Pandal
          score={score}
          harmony={harmony}
          stageIndex={currentStageIndex}
          totalStages={STAGE_ORDER.length}
          muted={muted}
          onToggleMute={handleToggleMute}
          onComplete={handleStageComplete}
        />
      );

    case 'DHOL':
      return (
        <Dhol
          score={score}
          harmony={harmony}
          stageIndex={currentStageIndex}
          totalStages={STAGE_ORDER.length}
          muted={muted}
          onToggleMute={handleToggleMute}
          onComplete={handleStageComplete}
        />
      );

    case 'ECO':
      return (
        <Eco
          score={score}
          harmony={harmony}
          stageIndex={currentStageIndex}
          totalStages={STAGE_ORDER.length}
          muted={muted}
          onToggleMute={handleToggleMute}
          onComplete={handleStageComplete}
        />
      );

    case 'AARTI':
      return <Aarti harmony={harmony} onComplete={handleAartiComplete} />;

    case 'RESULT':
      return (
        <Result
          totalScore={score + speedBonus}
          harmony={harmony}
          stageScores={stageScores}
          speedBonus={speedBonus}
          isNewBest={lastRun?.isNewBest ?? false}
          onPlayAgain={startGame}
          onMainMenu={goToMenu}
          onLeaderboard={goToLeaderboard}
        />
      );

    case 'LEADERBOARD':
      return (
        <Leaderboard
          currentRun={lastRun}
          onPlayAgain={startGame}
          onMainMenu={goToMenu}
        />
      );

    default:
      return (
        <Menu
          onStart={startGame}
          onTutorial={goToTutorial}
          onLeaderboard={goToLeaderboard}
          muted={muted}
          onToggleMute={handleToggleMute}
        />
      );
  }
}
