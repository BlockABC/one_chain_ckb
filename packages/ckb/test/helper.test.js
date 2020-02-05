const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { core, ckb } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))

const helper = ckb.helper
const Decimal = core.Decimal

/* eslint-disable quotes, object-curly-spacing, key-spacing, comma-spacing */
describe('helper', () => {
  describe('sumBy', () => {
    test('should be able to sum Decimals', () => {
      const data = [{ value: new Decimal(1) }, { value: new Decimal(2) }, { value: new Decimal(3) }]
      const ret = helper.sumBy(data, 'value')
      expect(ret.equals(6)).toBeTruthy()
    })
  })

  describe('isValidAddress', () => {
    test('should return true if address is valid', () => {
      const ret = helper.isValidAddress('ckb1qyqx56hx705nup6w42vh7vmedevgkggn0w4qq95d9a')
      expect(ret).toBeTruthy()
    })

    test('should return false if address is invalid', () => {
      const ret = helper.isValidAddress('1qyqx56hx705nup6w42vh7vmedevgkggn0w4qq95d9a')
      expect(ret).toBeFalsy()
    })
  })

  describe('isValidPublicKey', () => {
    test('should return true if param is 0x prefixed public key', () => {
      const ret = helper.isValidPublicKey('0x02c5d203d06605a109322fb94253a23f0e144cf228d7fab55eeb55b4b863a7b975')
      expect(ret).toBeTruthy()
    })

    test('should return true if param is 0x non-prefixed public key', () => {
      const ret = helper.isValidPublicKey('02c5d203d06605a109322fb94253a23f0e144cf228d7fab55eeb55b4b863a7b975')
      expect(ret).toBeTruthy()
    })

    test('should return false if public key is invalid', () => {
      const ret = helper.isValidPublicKey('0x02c5d203d06605a109322fb94253a23f0e144cf228d7fab55eeb55b4b863a7b97')
      expect(ret).toBeFalsy()
    })
  })

  describe('isValidPrivateKey', () => {
    test('should return true if param is 0x prefixed private key', () => {
      const ret = helper.isValidPrivateKey('0x33d37011da659ef62378bfdd245081ff8e9ea419312271caf826cce57f98303d')
      expect(ret).toBeTruthy()
    })

    test('should return true if param is 0x non-prefixed private key', () => {
      const ret = helper.isValidPrivateKey('33d37011da659ef62378bfdd245081ff8e9ea419312271caf826cce57f98303d')
      expect(ret).toBeTruthy()
    })

    test('should return true if even private key need to be paded', () => {
      const ret = helper.isValidPrivateKey('0xf70eea3041c793746f07d47f28a62d6555041b9edc74501a75ffbf47c55fc9')
      expect(ret).toBeTruthy()
    })

    test('should return false if private key is invalid', () => {
      const ret1 = helper.isValidPrivateKey('0x0')
      expect(ret1).toBeFalsy()

      const ret2 = helper.isValidPrivateKey('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
      expect(ret2).toBeFalsy()
    })
  })

  describe('generateKeypair', () => {
    test('should generate keypair', () => {
      const keypair = helper.generateKeypair('mainnet')
      expect(keypair).toEqual(expect.objectContaining({
        address: expect.stringMatching(/^ckb.{43}$/),
        publicKey: expect.stringMatching(/^0x.{66}$/),
        privateKey: expect.stringMatching(/^0x.{64}$/),
        wif: expect.stringMatching(/^0x.{64}$/),
      }))
    })
  })

  describe('privateKeyToAddress', () => {
    test('should generate keypair from privateKey', () => {
      const keypair = helper.privateKeyToAddress('0xdaf3e74a94ebdb09e9183562847f6f586859a51fa2b8d33acafe010f09424017', 'mainnet')
      expect(keypair).toMatchObject({
        address: 'ckb1qyqx56hx705nup6w42vh7vmedevgkggn0w4qq95d9a',
        publicKey: '0x03e3e9aae932e87185e8bfc1e43dcdd6d1a53a61d5c7763d6eafc8fdc5f8db0d70',
        privateKey: '0xdaf3e74a94ebdb09e9183562847f6f586859a51fa2b8d33acafe010f09424017',
        wif: '0xdaf3e74a94ebdb09e9183562847f6f586859a51fa2b8d33acafe010f09424017',
      })
    })

    test('should recover keypair from 0x prefixed private key format', () => {
      const keypair = helper.privateKeyToAddress('0xdaf3e74a94ebdb09e9183562847f6f586859a51fa2b8d33acafe010f09424017', 'mainnet')
      expect(keypair.address).toBe('ckb1qyqx56hx705nup6w42vh7vmedevgkggn0w4qq95d9a')
    })

    test('should recover keypair from 0x non-prefixed private key format', () => {
      const keypair = helper.privateKeyToAddress('daf3e74a94ebdb09e9183562847f6f586859a51fa2b8d33acafe010f09424017', 'mainnet')
      expect(keypair.address).toBe('ckb1qyqx56hx705nup6w42vh7vmedevgkggn0w4qq95d9a')
    })

    test('should throw error 12 if private key is invalid', () => {
      expect(() => {
        helper.privateKeyToAddress('0x0', 'mainnet')
      }).toThrowOneChainError(12)
    })
  })

  describe('lockToAddress', () => {
    test('should convert lock script to address', () => {
      const ret = helper.lockToAddress(
        {
          code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hash_type: 'type',
          args: '0x98695482a3c43b553427e817b001e4e4ec5e19cb'
        },
        'mainnet'
      )

      expect(ret).toBe('ckb1qyqfs625s23ugw64xsn7s9asq8jwfmz7r89s0hwv7r')
    })
  })

  describe('getRawTransactionID', () => {
    test('should return transaction ID of raw transaction', () => {
      const txId = helper.getRawTransactionID({"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c","index":"0x0"},"dep_type":"dep_group"}],"inputs":[{"previous_output":{"tx_hash":"0x1783bca44e9a369b068386e83a23aa8b8c2e652522032156c13ebc508078611b","index":"0x0"},"since":"0x0"}],"outputs":[{"capacity":"0x16b969d00","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"type":null},{"capacity":"0x33c812924","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"type":null}],"outputs_data":["0x","0x"],"header_deps":[],"witnesses":["0x55000000100000005500000055000000410000006ace3b75ff0a5ac726a30e975a89caf6bad7dd73210832d9f86cce530e1b361d4eb92783d3b57d8296efb72da03ddc24141e90ff8d3851f4240caa6bcf13423000"]})
      expect(txId).toBe('0xf0d0ab18093115760c2d9bb5718925d76603df85e13f102cc5d267aeda4ff38f')
    })
  })
})
