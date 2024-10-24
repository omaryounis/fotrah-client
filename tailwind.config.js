/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        fold: { min: "0", max: "320" },
        ...defaultTheme.screens,
      },
      backgroundColor: {
        primary: "#4D9D70",
      },
      textColor: {
        primary: "#4D9D70",
      },
      borderColor: {
        primary: "#4D9D70",
      },
      fontFamily: {
        neo: ["Neo Sans Arabic", "sans"], // 'sans' is the fallback font
        neoBold: ["Neo Sans W23"],
        shamel: ["FFShamelFamilySansOneBold", "sans"], // 'sans' is the fallback font
        frutiger: ["FrutigerLTArabic-65Bold", "sans"], // 'sans' is the fallback font
        inter: ["Inter", "sans"],
        readex: ["Readex Pro Deca ExtraLight", "sans"],
        readexBold: ["Readex Pro", "sans"],
        readexRegular: ["Readex Pro", "sans"],
      },
    },
  },
  plugins: [],
};
