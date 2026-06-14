import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        ink: { value: "#1f2933" },
        moss: { value: "#246b5b" },
        mossHover: { value: "#1f5c4f" },
        coral: { value: "#c65f4a" },
        wheat: { value: "#f2d8a7" },
        brand: {
          bg: { value: "#f8faf7" },
        },
        stone: {
          50: { value: "#fafaf9" },
          100: { value: "#f5f5f4" },
          200: { value: "#e7e5e4" },
          300: { value: "#d6d3d1" },
          400: { value: "#a8a29e" },
          500: { value: "#78716c" },
          600: { value: "#57534e" },
          700: { value: "#44403c" },
          800: { value: "#292524" },
          900: { value: "#1c1917" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
