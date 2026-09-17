// ============================================================
// MUSHAK — The player character (Lord Ganesha's mouse companion).
// A simple SVG illustration used on menu, aarti, and transitions.
// ============================================================

interface MushakProps {
  size?: number;
  className?: string;
}

export default function Mushak({ size = 120, className = '' }: MushakProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-label="Mushak the mouse"
    >
      {/* Body */}
      <ellipse cx="60" cy="75" rx="38" ry="30" fill="#A0826D" />
      <ellipse cx="60" cy="70" rx="30" ry="22" fill="#C4A884" />
      {/* Head */}
      <ellipse cx="60" cy="48" rx="26" ry="22" fill="#A0826D" />
      <ellipse cx="60" cy="44" rx="20" ry="16" fill="#C4A884" />
      {/* Ears */}
      <circle cx="42" cy="32" r="11" fill="#A0826D" />
      <circle cx="42" cy="32" r="7" fill="#F0A8C3" />
      <circle cx="78" cy="32" r="11" fill="#A0826D" />
      <circle cx="78" cy="32" r="7" fill="#F0A8C3" />
      {/* Eyes */}
      <circle cx="50" cy="44" r="4" fill="#3A1219" />
      <circle cx="70" cy="44" r="4" fill="#3A1219" />
      <circle cx="51" cy="43" r="1.5" fill="#FFF" />
      <circle cx="71" cy="43" r="1.5" fill="#FFF" />
      {/* Nose */}
      <circle cx="60" cy="54" r="3.5" fill="#7A2A38" />
      {/* Whiskers */}
      <line x1="48" y1="56" x2="35" y2="54" stroke="#7A2A38" strokeWidth="1" strokeLinecap="round" />
      <line x1="48" y1="58" x2="35" y2="60" stroke="#7A2A38" strokeWidth="1" strokeLinecap="round" />
      <line x1="72" y1="56" x2="85" y2="54" stroke="#7A2A38" strokeWidth="1" strokeLinecap="round" />
      <line x1="72" y1="58" x2="85" y2="60" stroke="#7A2A38" strokeWidth="1" strokeLinecap="round" />
      {/* Tail */}
      <path
        d="M 95 80 Q 108 75 105 90 Q 102 100 95 95"
        fill="none"
        stroke="#A0826D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Feet */}
      <ellipse cx="45" cy="100" rx="6" ry="4" fill="#8B6F5A" />
      <ellipse cx="75" cy="100" rx="6" ry="4" fill="#8B6F5A" />
      {/* Modak held in paws */}
      <ellipse cx="60" cy="72" rx="10" ry="8" fill="#F4E1B8" />
      <path d="M 50 72 Q 60 62 70 72" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  );
}
