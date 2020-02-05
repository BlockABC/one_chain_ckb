const { route, chainType, keypairs, provider, helper } = require('./ckb_init_blockchain')

// route = 'sign'

;(async () => {
  if (route === 'sign') {
    const unsignedTransaction = {}
    const unspents = []
    const signedTransaction = provider.sign({ transaction: unsignedTransaction, unspents })

    console.log('\nSigned transaction, ready for push:')
    console.log(JSON.stringify(signedTransaction))

    console.log('\nVisible transaction, for display only:')
    console.log(JSON.stringify(helper.parseRawTransaction(signedTransaction, unspents)))
  }
  else {
    provider.setKeypairs({ keypairs: [] })

    // Create unsigned transaction
    const tx = await provider.buildTransaction({
      froms: [
        { address: keypairs[0].address },
      ],
      tos: [
        { address: keypairs[1].address, value: '6100000000' },
      ],
      changeAddress: keypairs[0].address,
    })
    tx.edit({ feeRate: 1 })

    console.log('\nJSON stringified unspents: (need for sign)')
    console.log(JSON.stringify(tx.unspents))

    console.log('\nUnsigned transaction:')
    console.log(JSON.stringify(tx.rawTransaction))

    console.log('\nVisible transaction, for display only:')
    console.log(JSON.stringify(tx))
  }
})()
