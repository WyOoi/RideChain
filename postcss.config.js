// Mock implementation of tailwindcss/postcss
const tailwindcssPostcss = {
  postcssPlugin: 'tailwindcss-postcss-shim',
  Once() {}
};
tailwindcssPostcss.postcss = true;

// Export postcss config
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // Add the shim directly
    tailwindcssPostcss
  ],
};
