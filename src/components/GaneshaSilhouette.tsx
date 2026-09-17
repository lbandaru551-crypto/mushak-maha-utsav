// ============================================================
// GANESHA SILHOUETTE — A respectful, stylized representation of
// Lord Ganesha used only as a peaceful festival presence in the
// Aarti finale. Not interactive, not a combat target.
// ============================================================

interface GaneshaProps {
  size?: number;
  className?: string;
}

export default function GaneshaSilhouette({ size = 200, className = '' }: GaneshaProps) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      className={className}
      aria-label="Ganesha festival presence"
    >
      {/* Aura / halo */}
      <circle cx="100" cy="80" r="70" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" />
      <circle cx="100" cy="80" r="58" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.2" />

      {/* Body — seated posture */}
      <ellipse cx="100" cy="170" rx="55" ry="45" fill="#7A2A38" opacity="0.9" />
      <ellipse cx="100" cy="160" rx="42" ry="35" fill="#9B3A4A" opacity="0.85" />

      {/* Head */}
      <ellipse cx="100" cy="85" rx="38" ry="34" fill="#9B3A4A" />
      <ellipse cx="100" cy="82" rx="30" ry="27" fill="#B85467" opacity="0.7" />

      {/* Ears — large fan-shaped */}
      <ellipse cx="62" cy="75" rx="16" ry="22" fill="#9B3A4A" transform="rotate(-15 62 75)" />
      <ellipse cx="138" cy="75" rx="16" ry="22" fill="#9B3A4A" transform="rotate(15 138 75)" />

      {/* Trunk — curving down and to the left */}
      <path
        d="M 100 100 Q 88 115 82 130 Q 78 140 85 145 Q 92 148 95 140"
        fill="none"
        stroke="#9B3A4A"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Tusks */}
      <path d="M 92 108 Q 88 115 86 120" fill="none" stroke="#F4E1B8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 108 108 Q 112 115 114 120" fill="none" stroke="#F4E1B8" strokeWidth="3" strokeLinecap="round" />

      {/* Crown */}
      <path
        d="M 75 52 L 80 38 L 88 48 L 100 34 L 112 48 L 120 38 L 125 52 Z"
        fill="#D4AF37"
        opacity="0.8"
      />
      <circle cx="100" cy="38" r="4" fill="#FF9F1C" />

      {/* Third eye dot */}
      <circle cx="100" cy="70" r="3" fill="#FF9F1C" opacity="0.7" />

      {/* Hands — holding modak (left), blessing (right) */}
      <ellipse cx="70" cy="165" rx="12" ry="10" fill="#9B3A4A" />
      <circle cx="70" cy="165" r="6" fill="#F4E1B8" opacity="0.6" />
      <ellipse cx="130" cy="160" rx="10" ry="8" fill="#9B3A4A" />

      {/* Base / pedestal */}
      <ellipse cx="100" cy="215" rx="50" ry="12" fill="#6B2433" opacity="0.5" />
    </svg>
  );
}
