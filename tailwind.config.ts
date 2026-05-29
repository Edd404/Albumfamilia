import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        paper: "0 30px 80px rgba(74, 55, 38, 0.18)",
        soft: "0 12px 30px rgba(86, 61, 39, 0.12)",
        glow: "0 0 0 1px rgba(255,255,255,0.3), 0 25px 70px rgba(160, 119, 74, 0.18)",
      },
      colors: {
        cream: {
          50: "#fffdf8",
          100: "#f9f2e8",
          200: "#f0e2cf",
          300: "#e2cdb0",
          400: "#d0b08b",
          500: "#b98f65",
          600: "#9e7452",
          700: "#75533a",
          800: "#4f3926",
          900: "#302216",
        },
        rose: {
          50: "#fff6f4",
          100: "#ffe6e0",
          200: "#f8c8bd",
          300: "#ebaa9a",
          400: "#da8271",
          500: "#c96557",
          600: "#a84c3f",
          700: "#7f372f",
          800: "#55241f",
          900: "#341513",
        },
      },
      backgroundImage: {
        paper: "radial-gradient(circle at top, rgba(255,255,255,0.9), rgba(255,255,255,0.78) 35%, rgba(244,231,214,0.93) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
