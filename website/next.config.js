require('dotenv').config();

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
/* eslint-enable import/no-extraneous-dependencies */
const slug = require('remark-slug');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [slug],
  },
});
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = withMDX({
  webpack(config) {
    const customConfig = {
      ...config,
    };

    // Environment variables
    customConfig.plugins.push(new webpack.EnvironmentPlugin(process.env));

    // Issue with mini-css-extract-plugin throwing warnings about conflicting
    // order. This shouldn't matter for us because we are using CSS Modules.
    // Please remove if the issue gets resolved in future.
    // https://github.com/zeit/next-plugins/pull/315#issuecomment-457715973
    customConfig.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    );

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
  cssLoaderOptions: {
    localIdentName: '[name]_[local]_[hash:base64:5]',
  },
  future: {
    webpack5: true,
  },
});
