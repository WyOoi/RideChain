// This is a shim for the missing @tailwindcss/postcss module
// It returns an empty plugin that does nothing
module.exports = function() {
  return {
    postcssPlugin: 'tailwindcss-postcss-shim',
    Once() {}
  };
};

module.exports.postcss = true; 