/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B1220",
          card: "#111827",
          nav: "#0F172A",
          cyan: "#22D3EE",
          cyanHover: "#06B6D4",
          gold: "#FACC15"
        }
      }
    }
  },
  plugins: [],
}