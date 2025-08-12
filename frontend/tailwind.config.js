/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        poppins: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        outfit: ["Outfit", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        spaceGrotesk: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
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
