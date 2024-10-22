import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/**/*.{js,ts,jsx,tsx,mdx}", //test용 폴더 경로
  ],
  theme: {
    fontSize: {
      xs: ["12px", "18px"],
      sm: ["13px", "22px"],
      base: ["14px", "24px"],
      lg: ["16px", "26px"],
      xl: ["18px", "26px"],
      "2xl": ["20px", "32px"],
      "3xl": ["24px", "32px"],
      "4xl": ["32px", "42px"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black02: "#171717",
        black03: "#333236",
        black04: "#4B4B4B",
        gray01: "#787486",
        gray02: "#9FA6B2",
        gray03: "#D9D9D9",
        gray04: "#EEEEEE",
        gray05: "#FAFAFA",
        violet01: "#5534DA",
        violet02: "#F1EFFD",
        red01: "#D6173A",
        green01: "#7AC555",
        purple01: "#760DDE",
        orange01: "#FFA500",
        blue01: "#76A6EA",
        pink01: "#E876EA",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Helvetica Neue",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
