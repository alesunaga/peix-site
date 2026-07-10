import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: "#0f0e1f",
          indigo: "#6366f1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
