import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        moss: "#246b5b",
        coral: "#c65f4a",
        wheat: "#f2d8a7"
      },
      boxShadow: {
        line: "0 1px 0 rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;

