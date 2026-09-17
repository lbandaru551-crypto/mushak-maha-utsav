// ============================================================
// SCORE POPUP — Floating "+100" / "PERFECT" text that rises and fades.
// Rendered inside game screens when the player scores points.
// ============================================================

import type { ScorePopup as ScorePopupType } from '@/game/types';

export default function ScorePopupLayer({ popups }: { popups: ScorePopupType[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {popups.map((p) => (
        <div
          key={p.id}
          className="absolute font-display font-bold text-2xl animate-floatUp no-select"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            textShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
}
