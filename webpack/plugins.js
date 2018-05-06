const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PATHS = require('./paths');
require('dotenv').config();

exports.environmentVariables = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    STEEMCONNECT_REDIRECT_URL: JSON.stringify(process.env.STEEMCONNECT_REDIRECT_URL || 'http://localhost:3000/callback'),
  },
});

exports.lodash = new LodashModuleReplacementPlugin({
  collections: true,
  paths: true,
  shorthands: true,
  flattening: true,
});

exports.extractCss = new MiniCssExtractPlugin({
  filename: 'style.[hash].css',
  chunkFilename: '[id].[hash].css',
});

exports.html = new HtmlWebpackPlugin({
  title: 'Review',
  filename: 'index.html',
  template: `${PATHS.root}/template.html`,
});

exports.clean = new CleanWebpackPlugin([PATHS.public], { root: PATHS.root });

exports.sw = new GenerateSW();

exports.concat = new webpack.optimize.ModuleConcatenationPlugin();

exports.merge = new webpack.optimize.AggressiveMergingPlugin();
