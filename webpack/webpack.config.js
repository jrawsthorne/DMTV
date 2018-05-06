const merge = require('webpack-merge');
const PATHS = require('./paths');
const loaders = require('./loaders');
const plugins = require('./plugins');
require('dotenv').config();

const common = {
  entry: PATHS.src,
  output: {
    path: PATHS.public,
  },
  module: {
    rules: [
      loaders.babel,
      loaders.css,
      loaders.url,
    ],
  },
  plugins: [
    plugins.environmentVariables,
    plugins.extractCss,
    plugins.html,
  ],
};

let config;

if (process.env.NODE_ENV === 'production') {
  config = merge(
    common,
    {
      devtool: 'source-map',
      mode: 'production',
      output: {
        filename: 'review-[name].[chunkhash].js',
        publicPath: '/',
      },
      plugins: [
        plugins.clean,
        plugins.lodash,
        plugins.sw,
      ],
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
            },
          },
        },
      },
    },
  );
} else {
  config = merge(
    common,
    {
      devtool: 'eval-source-map',
      mode: 'development',
      output: {
        filename: 'review-[name].[hash].js',
        publicPath: '/',
      },
    },
    loaders.devServer({
      host: 'localhost',
      port: 3000,
    }),
  );
}

module.exports = config;
