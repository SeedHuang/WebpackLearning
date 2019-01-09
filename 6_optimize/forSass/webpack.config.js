const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const ExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const ExcludeEmptyAssetsPlugin = require('html-webpack-exclude-empty-assets-plugin');

const config = {
  entry: {
    home: './src/home/index.jsx',
    about: './src/about/index.jsx'
  },
  output: {
    filename: '[name]_[hash].js',
    path: path.resolve(__dirname, './dist'),
    chunkFilename: '[name]_[chunkhash].js'
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: true,
        cache: true,
        extractComments: true
      }),
      new OptimizeCssAssetsPlugin({
        outputs: {
          comments: false
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        reactjs: {
          test: /\/node_modules\/(react)/,
          chunks: "all",
          name: 'reactjs'
        },
        commonjs: {
          test: /\/node_modules\/(?!react)/,
          chunks: "all",
          name: 'commonjs'
        },
        commoncss: {
          // test: function(arg){
          //   const result = /\/src\/(common|panel)\/.*\.scss$/.test(arg.resource);
          //   if(result) {
          //     console.log(arg.resource, result, '>>>>>>');
          //   }
          //   return result;
          // },
          test: /\/(panel|common)\/.*\.scss$/,
          chunks: "all",
          name: "commoncss",
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ]
      },
      {
        test: /\.(c|sc)ss$/,
        exclude: /\/node_modules\//,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: true
            }
          },
          { loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name]_[chunkhash].css"
    }),
    new HtmlPlugin({
      filename: 'index.html',
      excludeAssets: [/commoncss.*.js/],
      template: path.resolve(__dirname, './src/home/index.ejs'),
      chunks: ['manifest', 'reactjs', 'commonjs','home', 'commoncss']
    }),
    new HtmlPlugin({
      filename: 'about.html',
      // excludeAssets: [/commoncss.*.js/],
      template: path.resolve(__dirname, './src/about/index.ejs'),
      chunks: ['manifest', 'reactjs', 'commonjs','about', 'commoncss'],
    }),
    // new ExcludeAssetsPlugin()
    new ExcludeEmptyAssetsPlugin()
  ],
  resolve: {
    extensions: [
      '.jsx',
      '.js'
    ]
  }
};

module.exports = config;
