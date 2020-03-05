module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss')(),
    require('postcss-preset-env')({
      stage: 0,
    }),
    require('postcss-extend-rule')(),
  ],
};
