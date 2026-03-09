/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pastel: '#F0F4FF',
          mint: '#E6FFFA',
          pink: '#FFF5F7',
          lavender: '#FAF5FF',
          primary: '#6366F1',
          success: '#10B981',
          danger: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
