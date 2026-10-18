/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#edf7f1",
          100: "#d5ecdd",
          500: "#168352",
          600: "#0d6c43",
          700: "#095435",
          800: "#073f2a",
          900: "#052d1f"
        },
        warm: {
          50: "#faf8f4",
          100: "#f1eee7",
          200: "#e4ded2",
          500: "#83796b",
          700: "#50483d",
          900: "#27231f"
        },
        amberTrust: "#b7791f"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(5, 45, 31, 0.08)"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
