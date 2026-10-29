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
          DEFAULT: '#16324F', // Civic Navy
          hover: '#0E2338',
          light: '#E8F0F8',
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
        },
        teal: {
          civic: '#0F9D92',
          'civic-light': '#CCFBF1',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          canvas: '#F5F7FB',
          hover: '#F1F5F9',
        },
        brandText: {
          primary: '#172033',
          secondary: '#64748B',
          tertiary: '#94A3B8',
        },
        semantic: {
          success: '#15803D',
          'success-light': '#DCFCE7',
          warning: '#D97706',
          'warning-light': '#FEF3C7',
          error: '#DC2626',
          'error-light': '#FEE2E2',
          info: '#2563EB',
          'info-light': '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
