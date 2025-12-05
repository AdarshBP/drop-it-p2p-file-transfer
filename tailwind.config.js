/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        bgsoft: '#151923',
        card: '#1b2130',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
