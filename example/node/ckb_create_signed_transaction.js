const { route, chainType, keypairs, provider, helper } = require('./ckb_init_blockchain')

;(async () => {
  if (route === 'push') {
    // Input raw transaction data in hex format here
    const data = {}
    const ret = await provider.pushTransaction({ transaction: data })

    console.log('\nTransaction ID:', ret)
  }
  else if (route === 'mnemonic') {
    // Input hdwallet data in json format here
    const data = ''
    const hdwallet = await provider.hdwalletFromJSON({ json: JSON.parse(data) })
    // Transfer with all keypairs in hdwallet
    const froms = hdwallet.getKeypairs().map(keypair => ({ address: keypair.address }))

    // Create signed transaction by addresses
    const transaction = await provider.buildAutoFixTransaction({
      froms,
      tos: [
        { address: keypairs[1].address, value: '6100000000' },
      ],
      changeAddress: froms[0].address,
    })
    transaction.edit({ feeRate: 1 })

    console.log('\nJSON stringified transaction:')
    console.log(JSON.stringify(transaction))

    console.log('\nSigned transaction, ready for push:')
    console.log(transaction.toHex())
  }
  else if (route === 'autofix') {
    // Create signed transaction to transfer all amount
    const tx = await provider.buildAutoFixTransaction({
      froms: [
        { address: keypairs[0].address },
      ],
      tos: [
        { address: keypairs[1].address, value: '2.1e18' },
      ],
      changeAddress: keypairs[0].address,
    })
    tx.edit({ feeRate: 1 })

    console.log('\nJSON stringified transaction:')
    console.log(JSON.stringify(tx.rawTransaction))

    console.log('\nVisible transaction, for display only:')
    console.log(JSON.stringify(tx))
  }
  else {
    // Create signed transaction to transfer part of amount
    const tx = await provider.buildTransaction({
      froms: [
        { address: keypairs[0].address },
      ],
      tos: [
        { address: keypairs[1].address, value: '6100000000' },
      ],
      changeAddress: keypairs[0].address
    })
    tx.edit({ feeRate: 1, tos: null, memos: null, keypairs: null, changeAddress: '' })

    console.log('\nSigned transaction, ready for push:')
    console.log(JSON.stringify(tx.rawTransaction))

    console.log('\nVisible transaction, for display only:')
    console.log(JSON.stringify(tx))
  }
})()
