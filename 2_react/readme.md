# Lession 2: Install react

> 上面说了一个怎样最简单一个webpack打包的应用跑起来的故事，他们这一次就来说说怎么把React跑起来的故事

## 准备开发环境
有几个依赖需要安装
```
# 你可以不用安装es6 to es5的转换器，但是现在写react谁还用es5呢，当然这个只是个人喜好，姑且就装了吧，preset-env与之前preset-es6 或者preset-stage-0等类似的预编译器不一样，可以通过.browserlist来制定目标浏览器的版本，所以之前的es6预编译器都不用了
npm install babel-loader @babel/core @babel/preset-env --save-dev

# @babel/preset-react, 以前不是叫这个名字的就叫preset-react，webpack4下面都加@babel了
npm install @babel/preset-react --save-dev

# clean-webpack-plugin，这个可以不安装，但是有洁癖的同学建议安装一下，每次在重新生成dist的时候，这个插件都会很温馨的把dist中的东西全都删除一遍。
npm install clean-webpack-plugin --save-dev

# 上一节课安装过的各类plugin
npm install html-webpack-plugin --save-dev

# 既然要使用react所以这两个肯定要装的
npm install react react-dom --save

```

## 配置
> 这就是为什么有些人被称为webpack配置工程师的原因，WTF

先上完整的，然后逐一解释

```
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");


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
        exclude: /\/node_modules|\/webpack.config/,
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

```
### resolve.extensions
这次多添加了`.jsx`，还是要提醒一下，是`.jsx`，不是`jsx`，不加就会出现类似 `Module not found: Error: Can't resolve 'object-assign'`这种没有把es6编译成es5的错误提示出现。

### module.rules
这里其实没有多大改动，就把`test: /\.js$/`改成了`test: /\.jsx?$/`，因为react的就是一个表现层，都是jsx语言来描述的。

### .babelrc
这次里面多了一个`@babel/preset-react`，用来预编译react的jsx

### 写react，没什么好说的
```
import reactDOM from 'react-dom';

reactDOM.render(<div>Hello World</div>, document.querySelector('#container'));

```
