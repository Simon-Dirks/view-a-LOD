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
          // primary: "#0084CA",
          primary: "#00839F",
          neutral: "#393939",
          accent: "#cae5ef", // Used for highlighting search results
          "primary-content": "white",
          // background: "white",
          background: "#E1ECF2",
          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
        },
      },
    ],
  },
  themes: ["main"],
};
