const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: path.join(__dirname, 'app.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 3000,
    host: "0.0.0.0",
    historyApiFallback: {
      index: '/index.html'
    }
  },
  devtool: 'inline-source-map',
  watchOptions: {
    poll: 1000
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './public/index.html', to: "index.html" }
    ])
  ]
};

module.exports = config;
