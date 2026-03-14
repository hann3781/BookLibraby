import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream:    "#FAFDF8",
        parchment: "#F4F7F0",
        "parchment-dark": "#E6EDE4",

        // Sage green family
        sage: {
          DEFAULT: "#7A9E7E",
          light:   "#B8D4BC",
          pale:    "#E8F2E9",
          dark:    "#4A7050",
          deep:    "#2D5035",
        },

        // Warm accent (caramel)
        warm: {
          DEFAULT: "#C4956A",
          light:   "#DDB896",
          dark:    "#A07045",
        },

        // Text
        forest: {
          DEFAULT: "#243320",
          medium:  "#3D5C3A",
          light:   "#5A7857",
        },

        // Gold for stars
        gold: "#D4A853",
      },
      fontFamily: {
        script:   ["var(--font-script)", "cursive"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        lora:     ["var(--font-lora)", "Georgia", "serif"],
      },
      boxShadow: {
        card:       "0 2px 16px rgba(36,51,32,0.10), 0 1px 4px rgba(36,51,32,0.07)",
        "card-hover":"0 6px 24px rgba(36,51,32,0.15), 0 2px 6px rgba(36,51,32,0.10)",
        cozy:       "0 4px 20px rgba(36,51,32,0.12)",
      },
      borderRadius: {
        card: "14px",
        book: "2px 8px 8px 2px",
      },
    },
  },
  plugins: [],
};

export default config;
