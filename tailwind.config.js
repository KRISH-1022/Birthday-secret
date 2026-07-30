/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0F0F10",
        darkCard: "rgba(22, 22, 26, 0.75)",
        warmGold: "#E6C280",
        warmGoldGlow: "rgba(230, 194, 128, 0.3)",
        softPink: "#F4C2C2",
        softPinkGlow: "rgba(244, 194, 194, 0.3)",
      },
      fontFamily: {
        serif: ["Cinzel", "Cormorant Garamond", "serif"],
        sans: ["Montserrat", "Plus Jakarta Sans", "sans-serif"],
        handwriting: ["Dancing Script", "cursive"]
      },
      backdropBlur: {
        xs: '4px',
        glass: '20px'
      },
      boxShadow: {
        glass: '0 20px 40px rgba(0, 0, 0, 0.6)',
        goldGlow: '0 0 30px rgba(230, 194, 128, 0.4)',
        roseGlow: '0 0 30px rgba(244, 194, 194, 0.4)'
      }
    },
  },
  plugins: [],
}
