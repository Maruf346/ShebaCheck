/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      "card-grid": "600px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      wide: "1200px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          ink: "#111827",
          amber: "#ffa000",
          yellow: "#ffb800",
          footer: "#110e0b",
        },
        forest: {
          50: "#edf7f1",
          100: "#d5ecdd",
          500: "#168352",
          600: "#0d6c43",
          700: "#095435",
          800: "#073f2a",
          900: "#052d1f",
        },
        warm: {
          50: "#faf8f4",
          100: "#f1eee7",
          200: "#e4ded2",
          500: "#83796b",
          700: "#50483d",
          900: "#27231f",
        },
        amberTrust: "#b7791f",
      },
      boxShadow: {
        "home-panel": "0 1px 1px rgb(180 83 9 / 6%)",
        "home-header": "0 8px 22px rgb(180 83 9 / 8%)",
        "home-button": "0 6px 16px -3px rgb(255 160 0 / 40%)",
        "home-button-hover": "0 8px 20px -3px rgb(255 160 0 / 45%)",
        "home-icon": "0 6px 16px rgb(255 160 0 / 25%)",
        soft: "0 18px 55px rgba(5, 45, 31, 0.08)",
      },
      maxWidth: {
        marketplace: "1240px",
      },
      borderRadius: {
        panel: "28px",
      },
      backgroundImage: {
        "home-canvas":
          "linear-gradient(145deg, #ffb800 0%, #ffa000 35%, #ff9000 70%, #ff8000 100%)",
        "home-featured":
          "linear-gradient(135deg, #ffb800 0%, #ffa000 45%, #ff7a00 100%)",
        "home-highlight":
          "linear-gradient(180deg, rgb(255 255 255 / 35%), rgb(255 255 255 / 0%))",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans Variable",
          "Noto Sans Bengali",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
