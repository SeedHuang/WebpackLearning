const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /\/node_modules\/|\/webpack.config.js/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
};
