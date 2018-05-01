const autoprefixer = require('autoprefixer');
const postcssFlexbugs = require('postcss-flexbugs-fixes');
const webpack = require('webpack');
require('dotenv').config()

module.exports = {
  entry: [
    './src/index.js',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|gif|png|jpe?g)(\?.+)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
      {
        test: /\.css|.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssFlexbugs,
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/public`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          STEEMCONNECT_REDIRECT_URL: JSON.stringify(
            process.env.STEEMCONNECT_REDIRECT_URL || 'http://localhost:3000/callback',
          ),
        },
      }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
      '/callback': 'http://localhost:3001',
    },
    contentBase: './public',
  },
};
