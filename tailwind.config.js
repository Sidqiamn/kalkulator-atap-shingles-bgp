/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#180F5E', 600: '#263E83', 700: '#1B145F' },
        ink: '#1C2943',
        canvas: '#F3F6FB',
        brand: { 50: '#F4F3FF', 100: '#E9E7FF', 200: '#D3CEFA', 500: '#7669DF', 600: '#5B4FD0' },
        accent: { DEFAULT: '#F28B29', 50: '#FFF7EE', 100: '#FDE6CF', 200: '#F6D3AD', 700: '#A85109', 800: '#7A3B06' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"','ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(.9)', opacity: '.3' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'slide-up': { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        pop: 'pop .28s ease-out',
        'slide-up': 'slide-up .2s ease-out',
      },
    },
  },
  plugins: [],
};
