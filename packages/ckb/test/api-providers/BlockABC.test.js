const path = require('path')
const packagesDir = path.dirname(path.dirname(path.dirname(__dirname)))
const { core, ckb } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))

const rpcnode = new core.RPCNode({
  chainId: 'mainnet',
  chainType: core.ChainType.CKB,
  baseUrl: 'https://ckb.abcwallet.com/api',
})
const api = new ckb.BlockABC(rpcnode, new core.LoggerHolder())

describe('BlockABC', () => {
  describe('ping', () => {
    test('should return if network is healthy', async () => {
      const ret = await api.ping()
      expect(ret).toEqual(expect.any(Number))
    })
  })

  describe('getAddresses', () => {
    test('should return transaction count of addresses', async () => {
      const ret = await api.getAddresses([
        'ckb1qyqdmeuqrsrnm7e5vnrmruzmsp4m9wacf6vsxasryq',
        'ckb1qyqpptcqwrlev6tgvcs0s23wxj3vkc9m2hwstdxpey',
      ])
      expect(ret).toEqual(expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          txCount: expect.any(Number)
        })
      ]))
    })
  })

  describe('getUnspentOfAddresses', () => {
    test('should return unspents of addresses', async () => {
      const ret = await api.getUnspentOfAddresses([
        'ckb1qyqpptcqwrlev6tgvcs0s23wxj3vkc9m2hwstdxpey',
      ])

      expect(ret).toEqual(expect.any(Array))
      if (ret.length > 0) {
        expect(ret).toEqual(expect.arrayContaining([
          expect.objectContaining({
            txId: expect.any(String),
            address: expect.any(String),
            vout: expect.any(Number),
            value: expect.any(core.Decimal),
            lock: expect.objectContaining({
              codeHash: expect.any(String),
              hashType: expect.any(String),
              args: expect.any(String),
            }),
            lockHash: expect.any(String),
          })
        ]))
      }
    })
  })
})
