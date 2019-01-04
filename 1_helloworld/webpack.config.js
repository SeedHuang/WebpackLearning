var path = require('path');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
    publicPath: 'http://127.0.0.1:8080'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /\/node_modules\/.*/
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: './index.html',
      // title: 'This is my titile', //通过htmlWebpackPlugin.options.title进行访问
      templateParameters: {
        title: 'This is my another title' // 直接通过title就可以访问
      }
    })
  ]
};
