const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  entry: path.join(__dirname, '/src/app.js'),
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      },
      {
        test: /\.(scss|css)/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // TODO: html webpack plugin breaks requests
    // new HtmlWebpackPlugin({ template: './src/index.template.ejs', inject: 'body', title: 'Token Marketplace' }),
    new CopyWebpackPlugin([{ from: './src/index.html', to: "index.html" }]),
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.$': 'jquery', 'window.jQuery': 'jquery',}),
  ]
};

module.exports = config;
