/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-be-vietnam)"],
          display: ["var(--font-be-vietnam)"],
          mono: ["var(--font-inter)"],
        },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "#0072BC", // Màu xanh dương đậm
            light: "#2196F3",   // Màu xanh dương nhạt hơn
            dark: "#005690",    // Màu xanh dương tối hơn
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#FFD700", // Màu vàng
            light: "#FFEB3B",   // Màu vàng nhạt
            dark: "#FFC107",    // Màu vàng tối
            foreground: "#000000",
          },
          destructive: {
            DEFAULT: "#DC2626",
            foreground: "#FFFFFF",
          },
          muted: {
            DEFAULT: "#F3F4F6",
            foreground: "#6B7280",
          },
          accent: {
            DEFAULT: "#0072BC",
            foreground: "#FFFFFF",
          },
          popover: {
            DEFAULT: "#FFFFFF",
            foreground: "#000000",
          },
          card: {
            DEFAULT: "#FFFFFF",
            foreground: "#000000",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)", 
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [],
  }