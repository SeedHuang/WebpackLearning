const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = function(env, argv) {
  const config = {
    entry: {
      index: './index.jsx',
      about: './about.jsx'
    },
    output: {
      filename: '[name]_bundle.js',
      path: path.resolve(__dirname, './dist')
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /\/node_modules\/|webpack\.config\.js/
        },
        {
          test: /\.(sc|c)ss$/,
          use: [ argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.jsx', '.js']
    },
    plugins: [
      new CleanPlugin(['dist']),
      new HtmlPlugin({
        filename: 'index.html',
        template: './index.html',
        chunks: [ 'index']
      }),
      new HtmlPlugin({
        filename: 'about.html',
        template: './about.html',
        chunks: [ 'about']
      })
    ]
  };
  return config;
}
