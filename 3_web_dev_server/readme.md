# Dev Server

> 按照目前的进度我们应该进入下一个重要环节了，不是通过webpack单独进行编译，而是要可以实时预览了否则，效率怎么跟得上呢？

## 准备工作
这次准备工作，就是将Lession2的webpack.config.js和package.json的依赖复制过来
```
# 安装开发环境依赖
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader html-webpack-plugin clean-webpack-plugin --save-dev

# 安装开发依赖
npm install react react-dom --save
```

然后这次多了一个新的小伙伴 `webpack-dev-server`;
```
npm install webpack-dev-server --save-dev
```

## 配置
老样子先上完整配置
```
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /\/node_modules\/|\/webpack.config.js/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
};
```

抱着负责任的态度，其实只是增加了`devServer.contentBase`这一个配置项，其他的都是在`webpack-dev-server`的命令中添加参数的，这里要详细的说一下 `package.json`中，`scripts.dev`的配置，
首先是需要杀死额外的node进程，因为每次webpack-dev-server启动都会启用新的进程，所以如果你频繁使用webpack-dev-server命令的话，你就会发现node进程愈来越多，最好的方法就是每次重启的以后就保证只有一个node进程在运行，干掉其他的
```
lsof -i:8080 | grep node | awk '{ print \"kill -9 \" $2}' | sh
```
经过实际使用发现在devServer里面设置HMR也没有用只能在CLI里面设置了。
