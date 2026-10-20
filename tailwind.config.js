// Antes Tailwind se cargaba desde cdn.tailwindcss.com, que compila en el
// navegador y deja un aviso de "no usar en produccion" en la consola.
// Ahora se compila una vez a /tailwind.css (ver README).
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: "#0F0F1A",
        paper: "#FBFAF7",
        accent: "#4F46E5",
        "accent-light": "#EEF2FF",
        "accent-mid": "#C7D2FE",
        rust: "#C2703D",
        "rust-light": "#FBEEE4",
        muted: "#6B7280",
        border: "#E7E3DA",
      },
    },
  },
};
