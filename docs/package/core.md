---
title: "@onechain/core"
lang: en-US
sidebarDepth: 3
----------

> - 由于参数众多，所有接口的参数都需要以 `{}` 的形式传递。
> - [param] 表示参数是可选的。

这个 package 是整个 SDK 的核心模块，推荐使用的导出模块如下：

```typescript
export { helper, Decimal }
export * from './interface'
export * from './const'
export * from './error'
export * from './RPCNode'
export * from './ConsoleLogger'
```

## 接口

详见 [interface.ts]

## 常量

### Level

日志等级

```typescript
enum Level { Trace, Debug, Info, Warn, Error }
```

## 错误

### OneChainError

此类错误包含了 `One Chain CKB` 的内部执行错误，大多数是可以修复的，极少数是链或依赖库限制导致无法修复的。

### ParamError

此类错误是在调用 `One Chain CKB` 接口时参数存在的错误，都是可以修复的，或需要用户重新输入的。

### RPCError

此类错误是在和 RPC 节点通信成功后，由 RPC 节点返回的错误，能否修复视情况而定。

### NetworkError

此类错误发生在网络通信失败时，是程序上不可修复的，需要用户自己解决网络环境存在的问题。

## Class RPCNode

### constructor

创建 `RPCNode` 对象，后续用于 SDK 的初始化。

#### PARAM

- chainId: `string` ，由于 CKB 还不存在约定的 chain ID ，这里使用的是 SDK 自定义的 `mainnet`, `testnet`。
- chainType: `string` ，固定是 `ckb`。
- baseUrl: `string` ，JSON RPC 的接入点。

#### RETURN

object: `IRPCNode` 详见 [interface.ts]。

#### Example

```typescript
const rpcnode = new RPCNode({
  chainId: 'mainnet',
  chainType: 'ckb',
  baseUrl: 'https://ckb.abcwallet.com/api',
})
```

## Class ConsoleLogger

### constructor

这是一个内置的 `ILogger` 实现，主要是为了方便调试 SDK 相关的调用，在较为复杂的工程中更加推荐实现自己的 `ILogger` 类。

#### PARAM

- name: `string` ，logger 的名字，请随意。
- level: `Level` ，必须是枚举类型 `Level` 。

#### RETURN

object: `ILogger` 详见 [interface.ts]。

#### Example

```typescript
const logger = new ConsoleLogger({
  name: 'main',
  level: Level.Trace,
})
```

[interface.ts]: https://github.com/BlockABC/one_chain_ckb/blob/develop/packages/core/src/interface.ts
