/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF5',
          100: '#FFF7E8',
          200: '#FBEFD4',
          300: '#F4E1B8',
        },
        maroon: {
          400: '#9B3A4A',
          500: '#7A2A38',
          600: '#6B2433',
          700: '#5A1E2B',
          800: '#4A1823',
          900: '#3A1219',
        },
        saffron: {
          300: '#FFC56B',
          400: '#FFB13D',
          500: '#FF9F1C',
          600: '#E8870A',
        },
        gold: {
          300: '#E8C97A',
          400: '#D4AF37',
          500: '#C9A227',
        },
        blush: {
          200: '#F7C5D9',
          300: '#F0A8C3',
          400: '#E88BAE',
        },
        eco: {
          300: '#A8D5A8',
          400: '#7FBF7F',
          500: '#5BA35B',
          600: '#3F8A3F',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(122, 42, 56, 0.08)',
        card: '0 8px 30px rgba(122, 42, 56, 0.12)',
        glow: '0 0 24px rgba(255, 159, 28, 0.35)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.9' },
          '100%': { transform: 'translateY(-120px) rotate(20deg)', opacity: '0' },
        },
        flameFlicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.95' },
          '50%': { transform: 'scaleY(1.12) scaleX(0.95)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        popBounce: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 159, 28, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 159, 28, 0.6)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        mandalaSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        stageEnter: {
          '0%': { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        scoreGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 2px 8px rgba(255, 159, 28, 0.3))' },
          '50%': { filter: 'drop-shadow(0 2px 20px rgba(255, 159, 28, 0.5))' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-8deg)' },
          '60%': { transform: 'scale(1.1) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        checkReveal: {
          '0%': { opacity: '0', transform: 'translateX(-12px) scale(0.8)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        softGlow: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        gentleRise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tilePop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        collectBurst: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        ringPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        slotFill: {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(1.2) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        glowExpand: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 159, 28, 0.4)' },
          '100%': { boxShadow: '0 0 40px 8px rgba(255, 159, 28, 0)' },
        },
      },
      animation: {
        floatUp: 'floatUp 2.5s ease-out forwards',
        flameFlicker: 'flameFlicker 1.8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.4s ease-out forwards',
        slideUp: 'slideUp 0.6s ease-out forwards',
        popBounce: 'popBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        shake: 'shake 0.4s ease-in-out',
        glowPulse: 'glowPulse 1.5s ease-in-out infinite',
        gentleFloat: 'gentleFloat 3s ease-in-out infinite',
        mandalaSpin: 'mandalaSpin 60s linear infinite',
        stageEnter: 'stageEnter 0.4s ease-out forwards',
        scoreGlow: 'scoreGlow 2.5s ease-in-out infinite',
        badgePop: 'badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        checkReveal: 'checkReveal 0.4s ease-out forwards',
        softGlow: 'softGlow 3s ease-in-out infinite',
        gentleRise: 'gentleRise 0.6s ease-out forwards',
        tilePop: 'tilePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        collectBurst: 'collectBurst 0.4s ease-out forwards',
        ringPulse: 'ringPulse 0.5s ease-out forwards',
        slotFill: 'slotFill 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        glowExpand: 'glowExpand 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
