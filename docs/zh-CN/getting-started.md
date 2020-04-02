---
title: 开始
lang: zh-CN
---

## 直接通过 `<script>` 载入

已编译好的 umd 模块位于 `packages/pack/dist/*.umd.js` 。


## NPM

```sh
npm i --save @onechain/ckb
```


## Yarn

```sh
yarn add @onechain/ckb
```


## 自己构建

首先 clone 这个仓库，然后：

```sh
yarn run reboot
yarn run build
```

> 这个仓库使用了 lerna 和 yarn workspace 来进行 monorepo 管理，所以你不能直接使用 `npm install`.


## 使用

### 环境要求

Node、Electron 以及任何支持 ES5+ 的现代浏览器！

### 示例

想知道如何开始？前往 [example] 查看示例，所有环境下的接口都是一致的。

> 执行 Node 相关示例之前，你需要 `cp .env.example .env` 并在 `.env` 中填入你自己的公私钥对，它们将在运行示例时被自动载入。


[example]: https://github.com/BlockABC/one_chain_ckb/tree/master/example
