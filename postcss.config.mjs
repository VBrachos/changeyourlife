
/** @type {import('postcss-load-config').Config} */

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customPrimary: "#3498db", // Custom primary color
        customSecondary: "#2ecc71", // Custom secondary color
        customBackground: "#1a1a1a", // Dark mode background color
        customText: "#f5f5f5", // Dark mode text color
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#3498db", // Custom primary for light mode
          secondary: "#2ecc71", // Custom secondary for light mode
          background: "#f9f9f9", // Light mode background color
          text: "#333333", // Light mode text color
        },
      },
      {
        dark: {
          primary: "#9b59b6", // Custom primary for dark mode
          secondary: "#e74c3c", // Custom secondary for dark mode
          background: "#1a1a1a", // Custom dark mode background color
          text: "#f5f5f5", // Custom text color for dark mode
        },
      },
    ],
  },
};
