# Tree Shaking

Tree Shaking 是用来减少npm package提及的一种方式，主要是将一些没有用到的死代码在最终打包时去除掉，这个方法的起源来自于[rollup.js](https://rollupjs.org/guide/en#tree-shaking), 以下是Rollup.js上关于TreeShaking介绍的原话
> In addition to enabling the use of ES modules, Rollup also statically analyzes the code you are importing, and will exclude anything that isn't actually used. This allows you to build on top of existing tools and modules without adding extra dependencies or bloating the size of your project.

经过实际验证，这一招就在es6下有用，其他下没有效果。经过babel编译的es6代码会带有副作用，导致模块不会将这些代码视为死代码（无效代码）所以会继续存在下去
