/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070708',
          900: '#0a0a0b',
          850: '#0e0e10',
          800: '#121214',
          700: '#18181b',
          600: '#222226',
          500: '#2e2e33',
        },
        fg: {
          DEFAULT: '#ededef',
          muted: '#a1a1aa',
          subtle: '#6b6b74',
          faint: '#45454c',
        },
        accent: {
          DEFAULT: '#c6ff3d',
          dim: '#9fd118',
          ink: '#0b0f00',
        },
        signal: {
          cyan: '#5ee6ff',
          amber: '#ffb547',
          red: '#ff5d5d',
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        shell: '1280px',
      },
    },
  },
  plugins: [],
};
