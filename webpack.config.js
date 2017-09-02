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
        test: /\.(scss|css)/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]'
      },
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
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),
  ]
};

module.exports = config;
