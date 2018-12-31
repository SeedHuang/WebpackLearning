const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

console.log(path.resolve('./dist', '/2'), '>>>>>>>>>>>>');
module.exports = {
  mode: 'development',
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  resolve:{
    extensions: ['.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules|\/webpack.config|dist/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: 'index.html',
      templateParameters: {
        title: 'This is a react test page'
      }
    })
  ]
};
