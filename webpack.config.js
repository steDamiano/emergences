const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
            test: /\.css$/,
            use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ]
  },
  resolve: {
    alias: {
      'three': path.join(__dirname, 'node_modules/three/build/three.js'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      'THREE': 'three',
    }),
  ],
  devServer: {
    https: true,
    key: ('dev.emergences.com.key'),
    cert: ('dev.emergences.com.crt'),
    host: '0.0.0.0',
    contentBase: './dist',
    open: true
  },
  node: {
    fs: 'empty'
  }
};