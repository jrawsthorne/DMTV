const merge = require('webpack-merge');
const PATHS = require('./paths');
const loaders = require('./loaders');
const plugins = require('./plugins');

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
        plugins.extractCss,
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
      plugins: [
        plugins.extractCssDev,
      ],
    },
    loaders.devServer({
      host: 'localhost',
      port: 3000,
    }),
  );
}

module.exports = config;
