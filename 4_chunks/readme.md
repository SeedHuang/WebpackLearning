# Chunks

> chunks的出现，很多时候伴随着MPA的页面结构，因为需要通过将公用部分提取出来以防止在另外一个页面使用到相同资源的时候还要再从cdn或非cdn服务器上下载一遍静态资源，另外一种可能性的确是为了提升SPA的性能，首先还是防止重复现在资源的浪费，因为像reactjs，lodash这类的第三方库不会经常更新，所以就算业务逻辑有更新也不用更新这些第三方库，毕竟他们很大，cdn的缓存只是适用于不刷新的情况下，在刷新的情况也是会重新请求资源的，这种情况就要使用到service work，以及被人唾弃的application cache，还有一种的情况是因为一些功能的使用率不是特别高或者在首屏看不见，所以没有必要和常用功能一起和首屏必须显示的功能的绘制逻辑放在一起，那么就可以lazyload这部分逻辑。这些就是就是chunks，相比于bundle将所有的逻辑放在一起，chunks只是将一系列和自己功能相关的逻辑放在一起，可以认为是一个更小的bundle范围。

以下的例子会议MPA的例子展开，顺便说一下多入口是怎么做的。

在Webpack4中有个比较大的更新，就会将原本`CommonsChunkPlugin`给去掉了，直接在添加到了optimization.splitChunks,你可以在cacheGroups里面进行设置

## 准备工作
这次准备工作，就是将Lession3的webpack.config.js和package.json的依赖复制过来
```
npm install @babel/preset-env @babel/preset-react @babel/core babel-loader html-webpack-plugin clean-webpack-plugin --save-dev
```

### 先上所有配置
```
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

```
### 设置多入口

如果是MPA，就是要设置多个entry

```
entry: {
  index: "./index.jsx",
  about: "./about.jsx"
}
```
但是这个和是否要切多个chunk没关系，只是MPA多数情况会使用chunks来解决静态资源反复加载的问题。
```
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
```
通过设置cacheGroups可以将所需要分别打包的代码部分进行分割

然后在每个HtmlWebpackPlugin中制定所需要的chunks
```
{
  ...
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
  ]
}
```
