const withCSS = require('@zeit/next-css');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withCSS(
  withMDX({
    pageExtensions: ['js', 'jsx', 'mdx'],
  }),
);
