const { createGlobPatternsForDependencies } = require("@nx/angular/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      body: ["Roboto", '"Helvetica Neue"', "sans-serif"],
      mono: ['"Roboto Mono"', "monospace"],
      "7seg": ['"FS Sevegment"', '"Roboto Mono"', "monospace"],
      logos: ["font-logos"],
    },
    extend: {
      colors: {
        alnitak: {
          50: "#e2fcff",
          100: "#b7f8fe",
          200: "#87f4fd",
          300: "#57effc",
          400: "#33ebfc",
          500: "#0fe8fb",
          600: "#0de5fa",
          700: "#0be2fa",
          800: "#08def9",
          900: "#04d8f8",
        },
        gray: {
          50: "#e6e6e6",
          100: "#c1c1c1",
          200: "#989898",
          300: "#6e6e6e",
          400: "#4f4f4f",
          450: "#424242",
          500: "#303030",
          600: "#2b2b2b",
          700: "#242424",
          800: "#1e1e1e",
          900: "#131313",
        },
      },
    },
  },
  plugins: [],
};
