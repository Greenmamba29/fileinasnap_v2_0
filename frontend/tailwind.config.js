/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      transitionProperty: {
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(59,130,246,0.25)',
      }
    },
  },
  plugins: [],
};
