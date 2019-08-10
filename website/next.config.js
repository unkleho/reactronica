const withCSS = require('@zeit/next-css');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withCSS(
  withMDX({
    pageExtensions: ['js', 'jsx', 'mdx'],
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: '[name]_[local]_[hash:base64:5]',
    },
  }),
);
