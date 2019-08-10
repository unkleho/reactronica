const withCSS = require('@zeit/next-css');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withCSS(
  withMDX({
    webpack(config) {
      const customConfig = {
        ...config,
      };

      // Next 9 introduced some pretty strict type checking
      // that breaks dev builds. It is now more relaxed,
      // however we may want to introduce again once all types
      // issues fixed
      // https://github.com/zeit/next.js/issues/7687#issuecomment-506440999
      customConfig.plugins = config.plugins.filter((plugin) => {
        if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin')
          return false;
        return true;
      });

      return customConfig;
    },
    pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: '[name]_[local]_[hash:base64:5]',
    },
  }),
);
