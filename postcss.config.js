// postcss.config.js
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // Use the correct Tailwind PostCSS plugin
    require('autoprefixer'),
  ],
};
