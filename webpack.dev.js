const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const BUILD_DIR = path.resolve(__dirname, 'assets/js/build');
// let APP_DIR = path.resolve(__dirname, 'js/src');

const config = merge.strategy({
  entry: 'prepend'
})(common, {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    // APP_DIR + '/entry.jsx',
  ],
  output: {
    publicPath: 'http://localhost:3000/js/build/'
  },
  devServer: {
    contentBase: BUILD_DIR,
    hot: true,
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats-dev.json'})
  ]
});

module.exports = config;
