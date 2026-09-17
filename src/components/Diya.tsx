// ============================================================
// DIYA — A decorative oil lamp with an animated flame.
// Used on menu, aarti, and results screens.
// ============================================================

interface DiyaProps {
  size?: number;
  className?: string;
}

export default function Diya({ size = 48, className = '' }: DiyaProps) {
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`} style={{ width: size }}>
      {/* Flame */}
      <div
        className="flame animate-flameFlicker"
        style={{
          width: size * 0.25,
          height: size * 0.4,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          marginBottom: -size * 0.05,
        }}
      />
      {/* Diya bowl */}
      <div
        style={{
          width: size,
          height: size * 0.4,
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #A0522D 100%)',
          borderRadius: '0 0 50% 50% / 0 0 80% 80%',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        }}
      />
      {/* Rim highlight */}
      <div
        style={{
          width: size * 0.9,
          height: size * 0.08,
          background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
          borderRadius: '50%',
          marginTop: -size * 0.42,
          opacity: 0.7,
        }}
      />
    </div>
  );
}
