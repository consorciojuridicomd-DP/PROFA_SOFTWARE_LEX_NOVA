export const tokens = {
  colors: {
    primary: {
      DEFAULT: "#FF5500", // LegalMind Orange
      foreground: "#FFFFFF",
      glow: "rgba(255, 85, 0, 0.5)",
    },
    secondary: {
      DEFAULT: "#1a1a1a",
      foreground: "#FFFFFF",
    },
    background: "#030303", // Deep dark
    foreground: "#FFFFFF",
    card: {
      DEFAULT: "rgba(10, 10, 10, 0.8)", // Glassmorphism
      foreground: "#FFFFFF",
      border: "rgba(255, 85, 0, 0.2)",
    },
    accent: {
      DEFAULT: "#FF8800",
      foreground: "#000000",
    },
    destructive: {
      DEFAULT: "#FF0000",
      foreground: "#FFFFFF",
    },
    muted: {
      DEFAULT: "#2a2a2a",
      foreground: "#888888",
    },
    border: "rgba(255, 255, 255, 0.1)",
    input: "rgba(255, 255, 255, 0.05)",
    ring: "#FF5500",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
  spacing: {
    container: "2rem",
  }
} as const;
