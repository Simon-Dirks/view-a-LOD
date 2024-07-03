/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Familjen Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        main: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0084CA",
          "primary-content": "white",
          neutral: "#0084CA",
          "neutral-content": "white",
          background: "white",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",

          // secondary: "red",
          // accent: "#00ffff",
          // "base-100": "#ff6dff",
          // "base-200": "#ff6dff",
          // "base-300": "#ff6dff",
          // info: "#0000ff",
          // success: "#00ff00",
          // warning: "#00ff00",
          // error: "#ff0000",
          // "--fallback-bc": "red",
          // "--bc": "#ff0000",
          // "--animation-btn": "0.25s",
          // "--animation-input": "0.2s",
          // "--btn-focus-scale": "0.95",
          // "--border-btn": "1px",
          // "--tab-border": "1px",
          // "--tab-radius": "0.5rem",
        },
      },
    ],
  },
  themes: ["main"],
};
