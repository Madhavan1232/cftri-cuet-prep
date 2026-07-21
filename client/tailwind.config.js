/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#FFFFFF',
          pageBg: '#FBFBFA',
          sidebar: '#F7F7F5',
          card: '#FFFFFF',
          border: '#E9E9E7',
          hover: '#EFEFED',
          text: '#37352F',
          muted: '#787774',
          subtle: '#9B9A97',
          tagBg: '#F1F1EF',
          // Dark Mode Tokens
          darkBg: '#191919',
          darkSidebar: '#202020',
          darkCard: '#252525',
          darkBorder: '#2E2E2E',
          darkHover: '#2C2C2C',
          darkText: '#E3E3E0',
          darkMuted: '#9B9B9B',
          darkTagBg: '#2D2D2D'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
        xl: '10px',
      }
    },
  },
  plugins: [],
}
