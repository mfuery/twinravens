const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'assets/js/build');

const config = merge(common, {
  output: {
    path: BUILD_DIR,
    filename: '[name]-[hash].js',
  },
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['js/build']),
    new MinifyPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BundleTracker({filename: './webpack-stats-prod.json'})
  ]
});

module.exports = config;
