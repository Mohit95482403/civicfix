/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#176B5B',
          hover: '#115447',
          light: '#E8F4F0',
        },
        accent: {
          DEFAULT: '#F4B942',
          hover: '#D9A336',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          canvas: '#F7F9FC',
          hover: '#F1F5F9',
        },
        brandText: {
          primary: '#172B3A',
          secondary: '#617386',
          tertiary: '#94A3B8',
        },
        semantic: {
          success: '#16845B',
          warning: '#B7791F',
          error: '#C83B3B',
          info: '#2463B5',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
