# Sass

> 终于Webpack章节迎来了暂时的终点，讲到优化css了

首先来说一下，虽然JS已经实现了TreeShaking，但是Css还没有，目前有比较接近的做法是使用purgecss将没有用到的css去掉，在webpack中，这个插件是`purgecss-webpack-plugin`

接下来看一下以下的配置

**webpack.config.js**
```
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
```
他会根据html，js，css依赖关系将没有用的css去掉

另外要说的就是css的split code，这里有个问题是如果你分割的
