/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          accent: "#FF4655", // Valorant Red accent
          gold: "#FD8D14",
          cyan: "#00F0FF"
        }
      }
    },
  },
  plugins: [],
}