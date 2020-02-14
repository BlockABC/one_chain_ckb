const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { ckb, core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))
const { FROM, FROM_1, TO, TO_1 } = require('./const')

const Decimal = core.Decimal
const Transaction = ckb.Transaction
const systemInfo = {
  hashType: 'type',
  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  outPoint: {
    txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
    index: '0x0',
  },
}

describe('Transaction', () => {
  describe('constructor', () => {
    test('should support 1 to 1 transaction', async () => {
      const tx = await (new Transaction()).init({
        systemInfo,
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
        unspents: [
          {
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash,
          },
        ],
        autoFix: false,
        wallets: {
          [FROM.address]: FROM.privateKey,
          [TO.address]: TO.privateKey,
        },
        network: ckb.constants.MAINNET,
      })

      // console.log(JSON.stringify(tx.rawTransaction))

      expect(tx).toEqual(expect.objectContaining({
        value: '6100000000',
        change: '0',
        fee: '3900000000',
        waste: '3900000000',
        inputs: [
          expect.objectContaining({
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: expect.Decimal('10000000000'),
          })
        ],
        outputs: [
          { address: TO.address, value: expect.Decimal('6100000000') },
        ],
      }))
    })

    test('should support 1 to n transaction', async () => {
      const tx = await (new Transaction()).init({
        systemInfo,
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' },
          { address: TO_1.address, value: '6100000000' },
        ],
        unspents: [
          {
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash,
          },
          {
            txId: '0x75c29a764406b223b889c6a95edaaaee7462764bd51e2871bf3e33b704227981',
            address: FROM.address,
            vout: 1,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash,
          }
        ],
        autoFix: false,
        wallets: {
          [FROM.address]: FROM.privateKey,
          [TO.address]: TO.privateKey,
        },
        network: ckb.constants.MAINNET,
      })

      // console.log(JSON.stringify(tx.rawTransaction))

      expect(tx).toEqual(expect.objectContaining({
        value: '12200000000',
        change: '7800000000',
        fee: '0',
        waste: '0',
        inputs: [
          expect.objectContaining({
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: expect.Decimal('10000000000'),
          }),
          expect.objectContaining({
            txId: '0x75c29a764406b223b889c6a95edaaaee7462764bd51e2871bf3e33b704227981',
            address: FROM.address,
            vout: 1,
            value: expect.Decimal('10000000000'),
          }),
        ],
        outputs: [
          { address: TO.address, value: expect.Decimal('6100000000') },
          { address: TO_1.address, value: expect.Decimal('6100000000') },
          { address: FROM.address, value: expect.Decimal('7800000000') },
        ],
      }))
    })

    test('should support n to n transaction', async () => {
      const tx = await (new Transaction()).init({
        systemInfo,
        froms: [
          { address: FROM.address },
          { address: FROM_1.address },
        ],
        tos: [
          { address: TO.address, value: '6100000000' },
          { address: TO_1.address, value: '6100000000' },
        ],
        unspents: [
          {
            txId: '0x28529352064ceda60db70a1cf2de996479187e6fec6ce1c27d3872e2f437a098',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash
          },
          {
            txId: '0xda2e0d1dc5f6ad8f9cf18faee192ce4a034e55b0981f1e5c0094888d9bc31bac',
            address: FROM_1.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM_1.lock,
            lockHash: FROM_1.lockHash
          },
        ],
        autoFix: false,
        wallets: {
          [FROM.address]: FROM.privateKey,
          [FROM_1.address]: FROM_1.privateKey,
        },
        network: ckb.constants.MAINNET,
      })

      // console.log(JSON.stringify(tx.rawTransaction))

      expect(tx).toEqual(expect.objectContaining({
        value: '12200000000',
        change: '7800000000',
        fee: '0',
        waste: '0',
        inputs: [
          expect.objectContaining({
            txId: '0x28529352064ceda60db70a1cf2de996479187e6fec6ce1c27d3872e2f437a098',
            address: FROM.address,
            vout: 0,
            value: expect.Decimal('10000000000'),
          }),
          expect.objectContaining({
            txId: '0xda2e0d1dc5f6ad8f9cf18faee192ce4a034e55b0981f1e5c0094888d9bc31bac',
            address: FROM_1.address,
            vout: 0,
            value: expect.Decimal('10000000000'),
          }),
        ],
        outputs: [
          { address: TO.address, value: expect.Decimal('6100000000') },
          { address: TO_1.address, value: expect.Decimal('6100000000') },
          { address: FROM.address, value: expect.Decimal('7800000000') },
        ],
      }))
    })
  })

  describe('edit', () => {
    test('should support edit feeRate', async () => {
      const tx = await (new Transaction()).init({
        systemInfo,
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' }
        ],
        unspents: [
          {
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash
          },
          {
            txId: '0x75c29a764406b223b889c6a95edaaaee7462764bd51e2871bf3e33b704227981',
            address: FROM.address,
            vout: 1,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash
          }
        ],
        autoFix: false,
        wallets: {
          [FROM.address]: FROM.privateKey,
          [TO.address]: TO.privateKey,
        },
        network: ckb.constants.MAINNET,
      })

      tx.edit({ feeRate: 1 })

      expect(tx).toEqual(expect.objectContaining({
        value: '6100000000',
        change: '13899999374',
        fee: '626',
        waste: '0',
        inputs: [
          expect.objectContaining({
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
          }),
          expect.objectContaining({
            txId: '0x75c29a764406b223b889c6a95edaaaee7462764bd51e2871bf3e33b704227981',
            address: FROM.address,
            vout: 1,
            value: new Decimal('10000000000'),
          }),
        ],
        outputs: [
          { address: TO.address, value: expect.Decimal('6100000000') },
          { address: FROM.address, value: expect.Decimal('13899999374') },
        ],
      }))
    })

    test('should calculate inputs and outputs with real fee(real = fee - waste)', async () => {
      const tx = await (new Transaction()).init({
        systemInfo,
        froms: [
          { address: FROM.address }
        ],
        tos: [
          { address: TO.address, value: '6100000000' },
        ],
        unspents: [
          {
            txId: '0x5cd921ef2345319651da505a38d9a2f4b94ba11ff603e2854d28f7cca4ae87b0',
            address: FROM.address,
            vout: 0,
            value: new Decimal('10000000000'),
            lock: FROM.lock,
            lockHash: FROM.lockHash
          },
        ],
        autoFix: false,
        network: ckb.constants.MAINNET,
      })
      expect(tx.fee).toBe('3900000000')
      expect(tx.waste).toBe('3900000000')

      tx.edit({ changeAddress: FROM.address })
      expect(tx.fee).toBe('3900000000')
      expect(tx.waste).toBe('3900000000')

      tx.edit({ fee: 0, changeAddress: FROM.address })
      expect(tx.fee).toBe('3900000000')
      expect(tx.waste).toBe('3900000000')
    })
  })
})
