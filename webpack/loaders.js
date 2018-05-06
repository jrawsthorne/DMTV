const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.css = {
  test: /\.css|.less$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [require('autoprefixer')], /* eslint-disable-line global-require */
      },
    },
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
      },
    },
  ],
};

exports.url = {
  test: /\.(eot|ttf|woff|woff2|svg|gif|png|jpe?g)(\?.+)?$/,
  use: ['url-loader'],
};

exports.babel = {
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          'env',
          'react',
          'stage-2',
        ],
      },
    },
    'eslint-loader',
  ],
  exclude: /node_modules/,
};

exports.devServer = function devServer(options) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port,
      contentBase: './public',
      proxy: {
        '/callback': 'http://localhost:3001',
        '/api': 'http://localhost:3002',
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multistep: true,
      }),
    ],
  };
};
