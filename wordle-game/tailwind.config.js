/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wordleGreen: '#6AAA64',
        wordleYellow: '#D2B458',
        wordleGray: '#787C7E',
      },
    },
  },
  plugins: [],
}
