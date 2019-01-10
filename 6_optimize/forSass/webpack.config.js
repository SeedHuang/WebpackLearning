const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')


const PATHS = {
  src: path.join(__dirname, 'src'),
  skyComponents: path.join(__dirname, 'node_modules', 'sky_components')
};


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
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    },
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\/(?!sky_components)/,
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
        exclude: /\/node_modules\/(?!sky_components)/,
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
      // filename: "[name].css",
      chunkFilename: "[name]_[chunkhash].css"
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/home/index.ejs'),
      chunks: ['manifest', 'reactjs', 'commonjs','home']
    }),
    new HtmlPlugin({
      filename: 'about.html',
      template: path.resolve(__dirname, './src/about/index.ejs'),
      chunks: ['manifest', 'reactjs', 'commonjs','about'],
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }).concat(glob.sync(`${PATHS.skyComponents}/**/*`,  { nodir: true }))
    }),
  ],
  resolve: {
    extensions: [
      '.jsx',
      '.js'
    ],
    mainFields: ['module', 'main']
  }
};

module.exports = config;
