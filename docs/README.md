---
title: Introduction
lang: en-US
---


## What is One Chain CKB ?

One Chain CKB is an SDK designed by the BlockABC team to solve the Nervos CKB chain compatibility in wallet development.
It is based on [ckb-sdk-js] (https://github.com/nervosnetwork/ckb-sdk-js).


## Why we need it?

### Build transactions base on cell model with ease

With @onechain/ckb you only need addresses and values to create transactions, no matter one-to-many or many-to-many:

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

And that's all! @onechain/ckb will fetch cells of giving addresses automatically, then it will build transaction base on a robust cell selecting algorithm.
After that, you can easily reach key information about the transaction:

| Properties |                Description                |
| ---------: | :---------------------------------------- |
|   tx.value | Total giving CKB                                  |
|  tx.change | Total change CKB                                  |
|   tx.waste | Can not be changed CKB because of less than 6100000000 shannon |
|    tx.size | Binary size of transaction after serializing                  |
|     tx.fee | Transaction fee                              |
|  tx.inputs | Transaction inputs                        |
| tx.outputs | Transaction outputs                       |

What about fee? How much should I pay? To solve this problem, @onechain/ckb implement an accurate fee estimating algorithm,
you can easily set fee rate instead of total fee:

```ts
tx.edit({ feeRate: 3 }) // set transaction fee rate to 3 shannon/Byte
```

### Build transaction without signing, then signin with a cold wallet

@onechain/ckb can create transactions without keypair. First you build unsigned transactions without keypairs, and then
signing with a cold wallet whenever you want:

```ts
const tx = ckb.sign({ transaction: unsignedTransaction, unspents: unspentsGetFromTxUnspents })
```

### Support HD wallet with ease

No need to take care of deriving process of HD wallet, but get keypairs with ease. @onechain/ckb will fetch addresses
status automatically in a optimized way:

```ts
const hdwallet = ckb.hdwalletFromMnemonic({ mnemonic: 'your mnemonic words', path: `m/44'/309'/0'`' })
```

### Provide commonjs and es6 module at the same time

No matter which module system you choose, you can just import this library easily, because we have faced the same problems
before so we sovled it for those follow our way.

### Provider umd module for usage in browser directly

It is the most classic, robust and easy way to import a library, so we will never give it up!


## Security

> Don't trust. Verify.

We recommend every user of this library join auditing and verifying of the code. Bugs will be always theres, the usability of design depends on cases, but every reporting and resolving issue will make this library better.

BE CAREFUL, **if you need sign transaction, the private key MUST exist in runtime**. So if any outside scripts run in the same context, **the private key may be LEAKED**! For example, you choose this sdk to handle signing in your dapp, all kinds of browser extensions can reach the keypairs in your dapp after it go online and run in user's browser.
