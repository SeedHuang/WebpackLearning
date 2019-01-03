[CodeSplitting](https://www.youtube.com/watch?v=tnwDajQ2Yms)
CodeSplitting at 10:32

![what_s_difference_between_hash_chunkhash_contenthash](./docImgs/whatsdifferencebetweenhaschunkhashandcontenthash.png)
[原文](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/153)

contentHash我没有试过，但是hash和chunkhash我是非常明白了
- hash是计算整个bundle得来的，所以只要有一个文件有改动，所有的文件的hash都会改变
- chunkhash是计算chunk得来的hash，所以每个文件是单独计算的，这样十分有利于LTC（long term cache）
