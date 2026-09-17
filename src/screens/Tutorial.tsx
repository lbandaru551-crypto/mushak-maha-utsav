// ============================================================
// TUTORIAL SCREEN — Five quick cards explaining each mini-game.
// Designed to be understood in under 15 seconds.
// ============================================================

import { sfxClick } from '@/game/audio';

interface TutorialProps {
  onBegin: () => void;
  onBack: () => void;
}

const CARDS = [
  { emoji: '🎨', title: 'Match the Rangoli', desc: 'Memorize the pattern, then recreate it from memory' },
  { emoji: '🍬', title: 'Prepare the Modak', desc: 'Tap the correct ingredients, avoid the wrong ones' },
  { emoji: '🏮', title: 'Decorate the Pandal', desc: 'Place flowers and diyas in the right zones' },
  { emoji: '🥁', title: 'Follow the Dhol', desc: 'Tap A S D F (or touch buttons) on the beat' },
  { emoji: '🌱', title: 'Make the Eco Choice', desc: 'Pick the eco-friendly festival option' },
];

export default function Tutorial({ onBegin, onBack }: TutorialProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 rangoli-bg">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #FFF7E8 0%, #FBEFD4 40%, #FFF7E8 100%)',
        }}
      />

      <div className="w-full max-w-2xl z-10 animate-scaleIn">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-maroon-700 text-center mb-2">
          How to Play
        </h2>
        <p className="text-center text-maroon-500 font-body text-sm mb-6">
          Five quick festival challenges — complete each to build your Utsav Harmony!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-4 shadow-soft flex items-start gap-3 animate-fadeIn"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl flex-shrink-0">{card.emoji}</div>
              <div>
                <h3 className="font-body font-bold text-maroon-700 text-sm">{card.title}</h3>
                <p className="text-xs text-maroon-500/80 font-body mt-1">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring explanation */}
        <div className="glass-card rounded-2xl p-4 shadow-soft mb-6 text-center">
          <p className="font-body text-sm text-maroon-600">
            Complete every challenge quickly and accurately to build your{' '}
            <span className="font-bold text-saffron-500">Utsav Harmony</span> and earn the highest score.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              sfxClick();
              onBegin();
            }}
            className="py-4 px-10 rounded-2xl bg-maroon-600 text-cream-50 font-body font-bold text-lg shadow-card btn-press hover:bg-maroon-500 transition-all ring-2 ring-gold-400/60 hover:ring-gold-400 hover:shadow-glow"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            LET'S BEGIN
          </button>
          <button
            onClick={() => {
              sfxClick();
              onBack();
            }}
            className="py-3 px-8 rounded-2xl bg-cream-100 text-maroon-700 font-body font-bold text-base shadow-soft btn-press hover:bg-cream-200 transition-colors"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}
