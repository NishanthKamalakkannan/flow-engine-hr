/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F97316",
          dark: "#1A1A2E",
          card: "#16213E",
          border: "#0F3460",
        },
      },
    },
  },
  plugins: [],
};