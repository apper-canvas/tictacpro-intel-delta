/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF006E',
        secondary: '#3A86FF',
        accent: '#FFBE0B',
        surface: '#1A1A2E',
        background: '#0F0F1E',
        success: '#06FFA5',
        warning: '#FFB700',
        error: '#FF4365',
        info: '#00D9FF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Righteous', 'ui-sans-serif', 'system-ui'],
        display: ['Righteous', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'neon-pink': '0 0 20px #FF006E50',
        'neon-blue': '0 0 20px #3A86FF50',
        'neon-yellow': '0 0 20px #FFBE0B50',
        'neon-green': '0 0 20px #06FFA550'
      }
    },
  },
  plugins: [],
}