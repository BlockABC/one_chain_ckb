# One Chain CKB

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[README](README.md) | [中文文档](README.zh.md)


## Why?

@onechain/ckb 是基于 [ckb-sdk-js](https://github.com/nervosnetwork/ckb-sdk-js) 的封装，但是为什么要这样做呢？

### 简单地构建基于 Cell 模型地交易

通过 @onechain/ckb 只需要知道地址和转账金额就可以构建 1 对 n，n 对 n 交易:

```ts
const tx = await ckb.buildTransaction({
  froms: [ // Addresses giving CKB
    { address: 'address_a' },
    { address: 'address_b' },
  ],
  tos: [ // Addresses receiving CKB and value
    { address: 'address_c', value: '6100000000' },
    { address: 'address_d', value: '6100000000' },
  ],
})
```

这就是构建交易的全部代码！@onechain/ckb 会自动查询未花费的 Cell，然后基于一套健壮的 Cell 筛选算法构建交易。
交易构建完成后，就可以通过交易对象轻易的获得交易的关键信息了：

| Properties |                Description                |
| ---------: | :---------------------------------------- |
|   tx.value | 总到账 CKB                                  |
|  tx.change | 总找零 CKB                                  |
|   tx.waste | 因为低于 6100000000 shannon 而无法找零的 CKB |
|    tx.size | 交易序列化后的二进制数据体积                  |
|     tx.fee | 交易的矿工费                              |
|  tx.inputs | 交易的输入                        |
| tx.outputs | 交易的输出                       |

矿工费怎么办？我应该支付多少？为了解决这个问题，@onechain/ckb 实现了一套精确的预估算法，
你可以简单的设置矿工费费率而非具体的矿工费：

```ts
tx.edit({ feeRate: 3 }) // set transaction fee rate to 3 shannon/Byte
```

### 构建未签名的交易，然后用冷钱包签名

@onechain/ckb 也可以不用公私钥对创建交易。首先创建一笔为签名的交易，然后在任何想要签名的时候通过冷钱包对其签名：

```ts
const tx = ckb.sign({ transaction: unsignedTransaction, unspents: unspentsGetFromTxUnspents })
```

### 轻轻松松支持 HD 钱包

无需关注 HD 钱包的推导细节，却能直接得到 HD 钱包的公私钥对。 @onechain/ckb 会自动以一种优化过的方式查询地址状态，从而高效的完成地址推导:

```ts
const hdwallet = ckb.hdwalletFromMnemonic({ mnemonic: 'your mnemonic words', path: `m/44'/309'/0'`' })
```

### 同时提供 commonjs 和 es6 模块

无论你选择哪种模块系统，你都能轻松的引入这个库，因为在开发这个库的过程中我们已经面对过同样的问题，所以我们为未来使用这个库的后来者铺平了道路。

### 提供 umd 模块以便直接在浏览器中使用

这是引入一个库最经典、健壮并且简单的方式，所以我们绝不会放弃它！


## 安全性

> 不要信任，亲自验证。

我们推荐 @onechain/ckb 的每个用户都参与到代码的审计与验证中来。 BUG 总是存在，可用性也取决于用例，但是每次 issue 的上报和解决都能帮助这个库变得更好。

小心！ **如果你要签名交易，那私钥就必定存在于运行时中**。 所以如果任何未知的脚本能在同样的上下文环境中运行，**那私钥就有可能发生泄漏**！


## 安装

### 直接通过 <script> 载入

请使用此位置的 umd 模块 `packages/pack/dist/*.umd.js` 。

### NPM

```sh
npm i --save @onechain/ckb
```

### 自己构建

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

想知道如何开始？前往 [examples](./example) 查看示例，所有环境下的接口都是一致的。

> 执行示例之前，你需要 `cp .env.example .env` 并在 `.env` 中填入你自己的公私钥对


## 开发

### 代码风格

我们使用一个稍微修改过的 standardjs 版本： https://github.com/BlockABC/eslint-config-blockabc


## License

[MIT](LICENSE)
