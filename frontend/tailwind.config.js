/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit'],
        poppins: ['Poppins', 'sans-serif']
      },
      colors: {
        'custom-green': '#00C261'
      }
    },
  },
  plugins: [],
}
