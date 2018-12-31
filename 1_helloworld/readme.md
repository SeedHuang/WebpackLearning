# Webpack4 自学笔记第一章 HelloWorld

## Webpack4主推0配置，但是也不是什么都不配置就可以开搞的的，今天就写一个最简单的HelloWorld
> 说个题外话，Webpack本身就是一个打包工具，webpack的理念就是将一切视作一个包进行管理，所以才叫“Web Pack”，其他的和打包无关的东西都是一些为了方便开发所附带的工具而已。

#### 安装webpack
需要安装Webpack和Webpack CLI，否则没有办法运行Webpack CLI命令和Webpack来打包，详情请查阅[webpack安装](https://webpack.js.org/guides/installation/#local-installation),所有的编译就是执行`webpack`

#### HelloWorld
写一个helloworld本身只需要使用`HtmlWebpackPlugin`的功能就可以了，这里有点跳跃，所以还是一步一步来

- 新建一个webpack.config.js文件，该文件是用来存储webpack相关配置的，webpack会默认去找目录下这个文件，获取编译所需要的配置

```
var path = require('path');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
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
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ]
};
```

##### entry
entry是指入口js文件的名称，一件入口js对应了一个页面。在SPA（但页面应用的情况下）只有一个入口js，但是MPA下会存在多个入口JS，这个时候需要用到将entry改写成另外一种形式

```
{
  'entry': {
    'index': './index.js',
    'about': './about.js'
  }
  ....
}
```
这个以后在将chunks的会使用到

##### output
输出目录，这个没有什么好多说的，在MPA的情况或者多Chunks的情况下，需要将filename改写成`[name].js`以适应名称自适应。

> path.resolve需要解释一下, `__dirname + /dist` 和 `path.resolve(__dirname, './dist')`的输出结果是一样的，但是作为一个专业的前段人员，谁会用`+`来做字符串链接呢，所以`path.resolve`成为一个你体现专业能力的地方，相似的还有`path.join(__dirname, dist)`, 但是`path.resolve`有一个比较容易忽略的坑，就是它永远从第一个绝对路径的地址开始计算，说了你就会有点疑惑，举个🌰：

```
path.resolve('./dist', './2');
# 输出的是/Users/SeedHuang/Desktop/WebpackLearning/2_react/dist/2

path.resolve('./dist', '/2');
# 输出的是/2
```
所以明白了吧，不要躺坑了。😄


##### plugins
这里就先讲一个很简单，但是很强大的Plugin，[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin),
HtmlWebpackPlugin中有很多配置，这个大家可以找对应的文档来查看，具体要讲的是配置模板参数的冲突：
首先，在模板当中，你可以通过`htmlWebpackPlugin.options`访问HtmlWebpackPlugin的配置，通过如：
**config**
```
{
  filename: 'index.html',
  title: 'This is my test title',
  template: './index.html'
}
```

**template**
```
<!DOCTYPE html>
<html>
  <title><%= htmlWebpackPlugin.options.title %></title>
  <body>
    <div id="container"></div>
  </body>
</html>
```
但是HtmlWebpackPlugin提供了一个更加符合给模板甚至参数的方式，`templateParameters`,这种设置参数的方式与之前通过`htmlWebpackPlugin.options`访问的方式是冲突的，如果同时出现两种配置

```
{
  filename: 'index.html',
  template: './index.html',
  title: 'This is my titile', //通过htmlWebpackPlugin.options.title进行访问
  templateParameters: {
    title: 'This is my another title' // 直接通过title就可以访问
  }
}
```

执行编译就会报错 `ERROR in   ReferenceError: htmlWebpackPlugin is not defined`

而且tempalteParatmeters中设置的参数，直接访问即可，不需要通过任何前缀。
```
<!DOCTYPE html>
<html>
  <title><%= title %></title>
  <body>
    <div id="container"></div>
  </body>
</html>
```

它接受三种类型的参数

Name |	Type |	Default |	Description
-----|-------|----------|----------------
templateParameters	| {Boolean/Object/Function}	 | -	| Allows to overwrite the parameters used in the template
