# Tree Shaking

Tree Shaking 是用来减少npm package提及的一种方式，主要是将一些没有用到的死代码在最终打包时去除掉，这个方法的起源来自于[rollup.js](https://rollupjs.org/guide/en#tree-shaking), 以下是Rollup.js上关于TreeShaking介绍的原话
> In addition to enabling the use of ES modules, Rollup also statically analyzes the code you are importing, and will exclude anything that isn't actually used. This allows you to build on top of existing tools and modules without adding extra dependencies or bloating the size of your project.

接下来我说一下TreeShake的思路，TreeShake在ESModule下，也就是使用以下形式导入模块和输出可被导出的内容的方式下，
```
import {x, y} from 'xxxx';
/******
内容省略
******/
export xxx from 'xxxx';
```
TreeShake会检查，所有这些标注了export的内容，有哪些是被实际调用方所导出，有哪些是没有被实际调用方所使用，所有的这些内容分析，在编译的时候，那些被标注export但没有实际调用方的导出内容将被取消export资格，也就是说 export的前缀就会被拿掉，而uglifyjs会把这些不可被访问的代码删掉，都是在静态的情况下完成，而不是在动态的情况下完成，这样才能最大限度的减少js的大小。

举个例子把，我自己做了npm包，我直接引入了es_module的index部分，npm中index的内容为
```
const myName = "My Name Seed Huang"

export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj));
};

export function isNotNull (obj) {
  console.log("this is not null");
  return obj !== null && obj !== undefined;
}

export function isNotEmpty (str) {
  console.log("is not empty");
  return isNotNull(str) && str !== '';
}

export function createAPerson (str) {
  console.log("this is create A Person");
  return new Person();
}

cloneDeep({a:1});
```

另外一个项目中引用了`isNotNull`

```
import { isNotNull } from './node_modules/utils_seedhuang/src/index';

isNotNull({a:1})
```

查看`mode = development`的情况的编译产出，如下，Webpack列出npm的index中哪些有用到，哪些没用到
> 因为production mode下，treeShake和去除代码的工作是同时进行的，而在development mode下看不见去掉export这一过程，要实现这个功能需要将webpack.config.js中 `optimization.usedExports`设置为`true`
**development**
```
/*!*************************************************************!*\
  !*** /Users/SeedHuang/Desktop/SeedHuang/utils/src/index.js ***!
  \*************************************************************/
/*! exports provided: cloneDeep, isNotNull, isNotEmpty, createAPerson */
/*! exports used: isNotNull */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* unused harmony export cloneDeep */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return isNotNull; });\n/* unused harmony export isNotEmpty */\n/* unused harmony export createAPerson */\nvar myName = \"My Name Seed Huang\";\nfunction cloneDeep(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}\n;\nfunction isNotNull(obj) {\n  console.log(\"this is not null\");\n  return obj !== null && obj !== undefined;\n}\nfunction isNotEmpty(str) {\n  console.log(\"is not empty\");\n  return isNotNull(str) && str !== '';\n}\nfunction createAPerson(str) {\n  console.log(\"this is create A Person\");\n  return new Person();\n}\ncloneDeep({\n  a: 1\n});\n\n//# sourceURL=webpack:////Users/SeedHuang/Desktop/SeedHuang/utils/src/index.js?");

/***/ }),
```
然后在production mode下，你就可以看见这些`unused`的export，就全被删掉了，🌟是uglifyjs做的

我们再来看下production下的产出的样子
**production**
```
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(n,o,s){"use strict";s.r(o);var i;function t(n){return console.log("this is not null"),null!=n}i={a:1},JSON.parse(JSON.stringify(i)),t({a:1})}],[[0,1]]]);
```
虽然在production下，有了很大改变，但还不是👩👩都不认得的地步，所以看一下，基本就剩下了
```
function t(n){return console.log("this is not null"),null!=n}
```
我们称之为**第一部分**

以及
```
i={a:1},JSON.parse(JSON.stringify(i)),t({a:1})
```
我们称之为第二部分

development产出的文件大小是2.45kb，treeshake并且压缩完之后只有203b，真的不是小了一点；

我们再来看第一部分和第二部分，来分析以下产出的结果是什么第一部分就是对应isNull这个export出来方法，这个是预期的，但是第二部分是什么呢？

第二部分对应的是

```
export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj));
};

cloneDeep({a:1});
```
虽然对外他没有任何调用方，但是在于内部，cloneDeep是一个iife，所以cloneDeep被保留了下来，这个就是要说到的另外一个知识点，sideEffects——副作用

有副作用的模块，只要被import了，这些副作用代码的部分都会被保留下来，哪怕其实你没有调用其中任何的方法，或者字段。

对此有一个删除带有副作用模块的方法，就是在npm包的package.json加上sideEffects为false的,这样如果仅仅只是import，没有实际调用，这个带有副作用的模块就会被删除，`sideEffects`这个标志位，不是说我里面的所有代码都是没有副作用的，这个代码多了，还有node_modules的依赖多了谁也说不准，主要是告诉webpack以及调用者，“放心删，没问题的，删掉这个没什么副作用，就是可以删的”；

接下来是对比
源码是
```
import { isNotNull } from './node_modules/utils_seedhuang/src/index';
```
没错，就是这一行，什么调用都没有

**没有pkg.sideEffect = false**
```
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(n,s,i){"use strict";i.r(s);var p;p={a:1},JSON.parse(JSON.stringify(p))}],[[0,1]]]);
```

**有pkg.sideEffect = false**
```
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(n,w,o){"use strict";o.r(w)}],[[0,1]]]);
```
什么都没有了😓，当然你也可以通过webpack来设置，毕竟，哪个有effects哪个没effect，使用者也需要有判断的权利
例如
```
rules: [
  {
    test: /\.js$/,
    exclude: /(\/node_modules\/utils_seedhuang\/).*.js$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          "presets": ["@babel/preset-env"],
          "plugins": ["@babel/plugin-proposal-class-properties"]
        }
      }
    ]
  },
  {
    test: /(\/node_modules\/utils_seedhuang\/).*.js$/,
    sideEffects: false,
    use: [
      {
        loader: 'babel-loader',
        options: {
          "presets": ["@babel/preset-env"],
          "plugins": ["@babel/plugin-proposal-class-properties"]
        }
      }
    ]
  }
]
```

说了那么多，其实就是要解释清除treeSkaking的工作原理，这个好的东西，现在很难跑起来的原因是因为，大多数npm包都是commonjs这种类型的，导入require，导出使用exports，treeShaking无法通过import，export这种es6语法定位呢哪些是用到的代码，哪些是没用到的代码，所以这么好的一个东西在这方面就碰到了问题，所以treeShaking只适用与esmodule，好在目前有些js库也提供esmodule语法的模块。
如果一个模块下有module并且指向一个esmodule类型的文件路径，那么，就可以使用treeShaking了，webpack已经可以通过在在resolve中设置mainFields: ['module', 'main']，来查看package.json上面是否设置module字段，按照mainFields先后顺序来查看主入口，最后我们来看一下webpack关于treeshaking的一个conclusion

```
So, what we've learned is that in order to take advantage of tree shaking, you must...

Use ES2015 module syntax (i.e. import and export).
Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of popular Babel preset @babel/preset-env - see documentation for more details).
Add a "sideEffects" property to your project's package.json file.
Use production mode configuration option to enable various optimizations including minification and tree shaking.
```

所以如果以后在做类库，esmodule的类库，应该是编译产出结果的一种

本文中所使用的utils_seedhuang，可以在npm上现在到，git地址是https://github.com/SeedHuang/utils
