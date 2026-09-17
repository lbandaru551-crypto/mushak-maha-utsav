// ============================================================
// PETALS — Ambient floating petal decoration used across screens.
// Pure CSS animation via Tailwind's floatUp keyframe.
// ============================================================

import { useMemo } from 'react';

const PETAL_COLORS = ['#F0A8C3', '#FFB13D', '#E84393', '#FFC56B', '#F7C5D9'];

interface PetalConfig {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export default function Petals({ count = 12 }: { count?: number }) {
  const petals = useMemo<PetalConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 14,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    }));
  }, [count]);

  return (
    <div className="petal-container">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `floatUp ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        >
          {/* Petal shape using border-radius */}
          <div
            className="w-full h-full"
            style={{
              background: p.color,
              borderRadius: '50% 0 50% 50%',
              opacity: 0.6,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
