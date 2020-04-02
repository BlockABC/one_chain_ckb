---
title: Getting Started
lang: en-US
---

## Directly Include `<script>`

Compiled umd module is located at `packages/pack/dist/*.umd.js` 。


## NPM

```sh
npm i --save @onechain/ckb
```


## Yarn

```sh
yarn add @onechain/ckb
```


## Build by yourself

Clone this repo first, then:

```sh
yarn run reboot
yarn run build
```

> This repo use lerna and yarn workspace for monorepo management, so you can not use `npm install`.


## Usage

### Requirements

Node, Electron, and any modern browser that support ES5+!

### Examples

Want to know how to get started? Go to [example], interfaces are the same in all environments.

> Before run examples for node, you need cp `.env.example` to `.env` and fill in your testing keypairs, they will be load when running examples.


[example]: https://github.com/BlockABC/one_chain_ckb/tree/master/example
