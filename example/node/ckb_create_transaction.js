const { route, chainType, keypairs, provider, helper } = require('./ckb_init_blockchain')

;(async () => {
  if (route === 'mnemonic') {
    const data = ''
    const hdwallet = await provider.hdwalletFromJSON({ json: JSON.parse(data) })
    // Transfer with all keypairs in hdwallet
    const froms = hdwallet.getKeypairs().map(keypair => ({ address: keypair.address }))

    // Create signed transaction by addresses
    const tx = await provider.buildAutoFixTransaction({
      froms,
      tos: [
        { address: keypairs[1].address, value: '6100000000' },
      ],
      changeAddress: froms[0].address,
    })
    tx.edit({ feeRate: 1 })

    const ret = await provider.pushTransaction({ transaction: tx })

    console.log('Create transaction:')
    console.log(ret)
  }
  else if (route === 'autofix') {
    // Transfer all coins
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

    const ret = await provider.pushTransaction({ transaction: tx })

    console.log('Create transaction:')
    console.log(ret)
  }
  else {
    // Transfer coins
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

    const ret = await provider.pushTransaction({ transaction: tx })

    console.log('Create transaction:')
    console.log(ret)
  }
})()
