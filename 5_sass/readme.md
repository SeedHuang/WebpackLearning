# Lession 5: With Sass


> Sass一加上去，各种loader，plugin就多起来了，所以要不直接用css？开玩笑，当然不能这么玩啦

## 这里有几个层次
- 用于css开发的loader：
 - style-loader
 - css-loader

- 用于将css优化的工具，其中就有抽取css到文件的工具，`mini-css-extract-plugin`;
- 用于将scss编译成css的工具，`sass-loader`

### 配置

#### 完整配置

```
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
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

```

Webpack4中已经可以不用`extract-text-webpack-plugin`，而有专用的`mini-css-extract-plugin`,相比较于原来的`extract-text-webpack-plugin`，他优点是
- ⭐️ Async loading
- ⭐️ No duplicate compilation (performance)
- Easier to use
- Specific to CSS

```
module: {
  rules: [
    ...
    {
      test: /\.(sc|c)ss$/,
      use: [ argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader']
    }
    ...
  ]
},
```
> 因为`mini-css-extract-plugin`没有具备HMR，所以在开发阶段使用style-loader在开发体验上面会比较好，而在生产环境中，为了让静态资源可以重逢利用浏览器缓存，所需要使用`mini-css-extract-plugin`来将css抽取到一个文件中

我们需要知道这几个loader的作用
- `style-loader`是用来将css将在到`<style></style>`中的
- `css-loader`是用来css如同js一样通过`import`加载进来，把css看成是一个包，可配置性强
- `sass-loader`则是将`sass`编译成`css`
- `mini-css-extract-plugin`将js中用到的css全都抽取出来到一个或多个文件中
