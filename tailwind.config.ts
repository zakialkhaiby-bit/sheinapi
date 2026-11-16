import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wasla: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          dark: "#0b192c",
          darker: "#060f1b",
          primary: "#1b4242",
          accent: "#09d17d",
          gold: "#eab308"
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
