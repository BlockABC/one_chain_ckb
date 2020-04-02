---
title: "@onechain/ckb"
lang: en-US
sidebarDepth: 3
----------

> - 由于参数众多，所有接口的参数都需要以 `{}` 的形式传递。
> - [param] 表示参数是可选的。
> - CKB 目前的转账金额最少不能低于 6100000000 shannon 。

这个 package 是主要的接口的实现，推荐使用的导出模块如下：

```typescript
export { constants, helper }
export * from './CKB'
export * from './HDWallet'
export * from './Transaction'
```

## Class CKB

### constructor

创建 CKB 对象，下面将简称为 provider ，将用于后续创建交易等，是一切的的开始。

#### PARAM

- rpcnode: `RPCNode` ，通过 `RPCNode.constructor` 创建。
- [keypairs]: `IKeypair[]` ，默认为 `[]` 需要 SDK 使用者自己构造，详见 [interface.ts]，如果不传可以创建未签名的交易，之后再在需要的时刻进行签名。
- [logger]: `ILogger` ，默认为 `null` ，一个 `ILogger` 实现，如果不传出错时会看不到任何日志。

#### RETURN

object: `IUTXOProvider` 详见 [interface.ts]。

#### Example

```typescript
const rpcnode = new RPCNode(...)
const logger = new ConsoleLogger(...)

const provider = new CKB({
  rpcnode,
  keypairs: [
    { address: '', privateKey: '' },
    { address: '', privateKey: '' },
  ],
  logger,
})
```

### setKeypairs

修改 provider 内的公私钥对，可以用于切换不同公私钥对签名、延迟传入公私钥对的情况。

#### PARAM

- keypairs: `IKeypair[]` 需要 SDK 使用者自己构造，详见 [interface.ts]，如果需要清空请传 `[]`。

#### RETURN

void

#### Example

```typescript
const provider = new CKB(...)

provider.setKeypairs({
  keypairs: [
    { address: '', privateKey: '' },
    { address: '', privateKey: '' },
  ],
})
```

### setRPCNode

修改 provider 内的 RPCNode 实例，可以用于切换不同链。

#### PARAM

- rpcnode: `RPCNode` ，通过 `RPCNode.constructor` 创建。

#### RETURN

void

#### Example

```typescript
const provider = new CKB(...)
const rpcnode = new RPCNode(...)

provider.setRpcnode({ rpcnode })
```

### sign

对交易进行签名。

#### PARAM

- transaction: `RPC.RawTransaction` ，CKB RPC 节点可接受的原始交易结构，请不要手工构造，使用 `buildTransaction` 接口构造。
- unspents: `IUTXOUnspent[]` ，详见 [interface.ts]。

#### RETURN

object: `RPC.RawTransaction` ，返回值 `JSON.stringify` 后就可以直接通过 CKB RPC 节点推送了。

#### Example

```typescript
const rawTx = provider.sign({
  transaction,
  unspents: [
    {
      txId: string,
      address: string,
      vout: number,
      value: Decimal.Value,
      lock: any,
      lockHash: string,
    },
    ...
  ]
})
```

### buildTransaction

构造交易。

#### PARAM

- froms: `IUTXOFromToParam[]` ，详见 [interface.ts]，转出地址列表，。
- tos: `IUTXOFromToParam[]` ，详见 [interface.ts]，转入地址和金额列表，。
- changeAddress: `string` ，找零地址列表， `tos` 和 `froms` 之间的差额会被转入到这个地址。

#### RETURN

object: `Transaction` ，也就是 `Transaction` 类的实例。

#### Example

```typescript
const tx = await provider.buildTransaction({
  froms: [
    { address: 'A' },
    { address: 'B' },
  ],
  tos: [
    { address: 'C', value: '6100000000' },
    { address: 'D', value: '6100000000' },
  ],
  changeAddress: 'A'
})
```

### buildAutoFixTransaction

构造交易，和 buildTransaction 稍有不同，如果转出金额超过了余额，会被自动限制在余额之内，需要做到 “转出全部” 的样的效果时就需要这个接口。

#### PARAM

- froms: `IUTXOFromToParam[]` ，详见 [interface.ts]，转出地址列表，。
- tos: `IUTXOFromToParam[]` ，详见 [interface.ts]，转入地址和金额列表，。
- changeAddress: `string` ，找零地址列表， `tos` 和 `froms` 之间的差额会被转入到这个地址。

#### RETURN

object: `Transaction` ，也就是 `Transaction` 类的实例。

#### Example

```typescript
const tx = await provider.buildAutoFixTransaction({
  froms: [
    { address: 'A' },
    { address: 'B' },
  ],
  tos: [
    { address: 'C', value: '6100000000' },
    { address: 'D', value: '6100000000' },
  ],
  changeAddress: 'A'
})
```

### pushTransaction

推送交易。

#### PARAM

- transaction: `Transaction | string` ，可以是 buildTransaction 接口构造的交易对象，也可以是 CKB RPC 节点接受的原始交易。

#### RETURN

txId: `string` ，被推送交易的 ID。

#### Example

```typescript
const tx = await provider.buildAutoFixTransaction(...)
const txId = await provider.pushTransaction({ transaction: tx })
```

### hdwalletFromMnemonic

从助记词推导 HD 钱包结构。

#### PARAM

- mnemonic: `string` ，助记词。
- path: `string` ，推导路径，遵循 [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) 的路径是 `m/44'/309'/0'`。
- needSync: `boolean` ，默认为 `true`，是否通过网络同步。

#### RETURN

object: `IUTXOHDWallet` ，也就是 `HDWallet` 类的实例。

#### Example

```typescript
const hdwallet = await provider.hdwalletFromMnemonic({
  mnemonic: '',
  path: `m/44'/309'/0'`,
})
```

### hdwalletFromJSON

从 `HDWallet.toJSON` 返回的 JSON 数据中回复 `HDWallet` 实例，通过缓存 JSON 数据可以避免需要每次重新同步 HD 钱包。

#### PARAM

- json: `any` ， `HDWallet.toJSON` 的返回值。

#### RETURN

object: `IUTXOHDWallet` ，也就是 `HDWallet` 类的实例。

#### Example

```typescript
const hdwallet = await provider.hdwalletFromMnemonic({ json })
```


## Class Transaction

### Properties

- value: string ，总转出金额。
- change: string ，总找零金额
- fee: string ，总矿工费，包含浪费的部分。
- waste: string ，总浪费金额，也就是无法找零的部分，当找零金额低于 6100000000 shannon 时就会产生。
- size: string ，当前交易体积。
- unspents: IUTXOUnspent ，转出地址所有可用的未花费 Cell 。
- inputs: IUTXOInput ，交易的输入。
- outputs: IUTXOOutput ，交易的输出。
- rawTransaction: string ，CKB RPC 节点接受的原始交易数据。

### edit

编辑交易。

#### PARAM

- [fee]: `Decimal.Value` ，修改矿工费，设置这个参数后 `feeRate` 就不再生效。
- [feeRate]: `Decimal.Value` 修改矿工费费率，以 **shannon/Byte** 计算，如果不知道具体应付多少矿工费就可以使用这个费率值。
- [tos]: `IUTXOFromToParam[]` 修改收款地址和金额。
- [keypairs]: `IKeypair[]` 修改签名用的公私钥。
- [changeAddress]: `string` 修改找零地址。

#### RETURN

void

#### Example

```typescript
const tx = provider.buildTransaction(...)
tx.edit({ feeRate: 1 })
```

### toJSON

转为 CKB RPC 节点可直接推送的 JSON 数据。

#### PARAM

void

#### RETURN

object: `RPC.RawTransaction`

#### Example

```typescript
const tx = provider.buildTransaction(...)
const rawTx = tx.toJSON()
```


## Class HDWallet

### Properties

- static ADDRESS_ALL: string ，地址类型
- static ADDRESS_CHANGE: string ，地址类型
- static ADDRESS_RECEIVING: string ，地址类型
- mnemonic: string ，助记词。
- path: string ，推导的根路径。
- receiving: IAddress[] ，外链地址。
- change: IAddress[] ，内链地址。

### derive

推导 HD 钱包结构，当从 JSON 数据中回复 HD 钱包或长时间未使用后，如果希望得出 HD 钱包最新的状态就需要调用这个接口进行推导。

#### PARAM

- [syncfromStart]: `boolean` ，默认为 `false` ，是否从头开始推导整个 HD 钱包的结构。

#### RETURN

void

#### Example

```typescript
const hdwallet = provider.hdwalletFromMnemonic(...)
await hdwallet.derive()
```

### getKeypairs

获得 HD 钱包中的公私钥。

#### PARAM

- [type]: string ，需要获取的地址类型，默认是 `HDWallet.ADDRESS_ALL`

#### RETURN

array: `IKeypair[]`

#### Example

```typescript
const hdwallet = provider.hdwalletFromMnemonic(...)
const keypairs = hdwallet.getKeypairs({ type: HDWallet.ADDRESS_RECEIVING })
```

### toJSON

将 HD 钱包转为可以缓存的 JSON 数据结构。

#### PARAM

void

#### RETURN

object: `any`

#### Example

```typescript
const hdwallet = provider.hdwalletFromMnemonic(...)
const data = hdwallet.toJSON()
```


[interface.ts]: https://github.com/BlockABC/one_chain_ckb/blob/master/packages/core/src/interface.ts
