const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './layouts/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      "sans": ['Poppins', ...defaultTheme.fontFamily.sans],
      "Roboto": ['Roboto', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        primary: "#F7628C",
        secondary: "#87F3B5",
        tertiary: "#49516F",
        "color-base": "#F2F2F2",
      },
      transitionProperty: {
        'height': 'height'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/line-clamp'),
  ],
} 
