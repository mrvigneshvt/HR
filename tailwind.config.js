/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/index.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}", // If you have a components folder
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
