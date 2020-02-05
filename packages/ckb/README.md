# @onechain/ckb

Main module for build ckb transactions, dervive HD wallets.


## Convention

1. Chain ID of CKB is unknown, so here we choose `mainnet, testnet, regtest` these keywords as chain ID.
2. BIP44 path of CKB is come from [slip-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).


## Dependencies

- bip32 is maintained by bitcoinjs, works as a main denpendency in bitcoinjs-lib.
- bip39 is maintained by bitcoinjs, works as a main denpendency in bitcoinjs-lib, web3.
- decimal.js has 3000+ star on github, maybe the best Decimal implemention in js.
- node-fetch implement fetch for node，has 3000+ star on github，has 800w+ downloads per week on npm, works as a main denpendency in eosjs.
- util implement util module of node for other environment，has 1000w+ downloads per week on npm.
