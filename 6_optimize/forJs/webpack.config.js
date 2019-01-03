const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const AnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = function(env, argv) {
  const config = {
    entry: {
      index: './index.jsx',
      about: './about.jsx'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name][hash].js',
      chunkFilename: '[name]_[chunkhash].js'
    },
    resolve: {
      extensions: ['.jsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new CleanPlugin(['dist']),
      new HtmlPlugin({
        filename: 'index.html',
        template: './index.html',
        chunks: ['manifest', 'react', 'common', 'index']
      }),
      new HtmlPlugin({
        filename: 'about.html',
        template: './about.html',
        chunks: ['manifest', 'react', 'common', 'about']
      }),
      new AnalyzerPlugin({
        analyzerMode: 'none'
      }),
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        cacheGroups: {
          react: {
            name: 'react',
            test: /\/node_modules\/(react)/,
            chunks: 'all'
          },
          common: {
            name: 'common',
            test: /\/node_modules\/(?!react)/,
            chunks: 'all'
          }
        }
      }
    }
  }
  return config;
};
