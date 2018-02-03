let webpack = require('webpack');
let path = require('path');
let BundleTracker = require('webpack-bundle-tracker');
let BUILD_DIR = path.resolve(__dirname, 'js/build');
let APP_DIR = path.resolve(__dirname, 'js/src');

let config = {
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    APP_DIR + '/entry.jsx',
  ],
  output: {
    path: BUILD_DIR,
    filename: '[name]-[hash].js',
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
  devtool: 'eval',
  module: {
    rules:[
      {
        test: /\.jsx?/,
        include: APP_DIR,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      { // scss loader for webpack
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats.json'})
  ],
};

module.exports = config;