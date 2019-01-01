const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ClearnWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: "./index.jsx",
    about: "./about.jsx"
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]_bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /\/node_modules\/|\/webpack.config.js/
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['common', 'react', 'index']
    }),
    new HtmlPlugin({
      filename: 'about.html',
      template: './about.html',
      chunks: ['common', 'react', 'about']
    }),
    new ClearnWebpackPlugin(['dist'])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          name: "react",
          test: /\/node_modules\/(react)/,
          chunks: "all"
        },
        common: {
          name: "common",
          test: /\/node_modules\/(?!react)/,
          chunks: "all"
        }
      }
    }
  }
};
