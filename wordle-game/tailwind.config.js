/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wordle-green': '#6AAA64',
        'wordle-yellow': '#D2B458',
        'wordle-gray': '#787C7E',
      },
    },
  },
  plugins: [],
}
