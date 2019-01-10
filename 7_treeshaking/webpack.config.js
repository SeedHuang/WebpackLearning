const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
var Visualizer = require('webpack-visualizer-plugin');
const AnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: {
    'index': './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  optimization: {
    usedExports: true,
    runtimeChunk: {
      name: 'manifest'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(\/node_modules\/utils_seedhuang\/).*.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              "presets": ["@babel/preset-env"],
              "plugins": ["@babel/plugin-proposal-class-properties"]
            }
          }
        ]
      },
      {
        test: /(\/node_modules\/utils_seedhuang\/).*.js$/,
        sideEffects: false,
        use: [
          {
            loader: 'babel-loader',
            options: {
              "presets": ["@babel/preset-env"],
              "plugins": ["@babel/plugin-proposal-class-properties"]
            }
          }
        ]
      }
    ]
  },
  resolve:{
    extensions: ['.js'],
    mainFields: ['module', 'main']
  },
  devServer: {
    contentBase: ['dist']
  },
  plugins:[
    new HtmlPlugin({
      'template': './index.ejs',
      'filename': 'index.html',
      'chunks': ['manifest', 'index']
    }),
    new Visualizer({
      filename: './statis.html'
    }),
    new AnalyzerPlugin({
      analyzerMode: 'static'
    })
  ]
}

module.exports = config;
