const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require('./matchers')

const helper = core.helper
const Decimal = core.Decimal

describe('helper', () => {
  describe('isNil', () => {
    test('should works', () => {
      expect(helper.isNil(null)).toBeTruthy()
      expect(helper.isNil(undefined)).toBeTruthy()
      expect(helper.isNil(0)).toBeFalsy()
      expect(helper.isNil(false)).toBeFalsy()
    })
  })

  describe('isString', () => {
    test('should works', () => {
      expect(helper.isString('')).toBeTruthy()
      expect(helper.isString(0)).toBeFalsy()
      expect(helper.isString(true)).toBeFalsy()
      expect(helper.isNumber(null)).toBeFalsy()
      expect(helper.isString({})).toBeFalsy()
      expect(helper.isString([])).toBeFalsy()
    })
  })

  describe('isInteger', () => {
    test('should works', () => {
      expect(helper.isInteger('1')).toBeFalsy()
      expect(helper.isInteger(1)).toBeTruthy()
    })
  })

  describe('isNumber', () => {
    test('should works', () => {
      expect(helper.isNumber('')).toBeFalsy()
      expect(helper.isNumber(0)).toBeTruthy()
      expect(helper.isNumber(true)).toBeFalsy()
      expect(helper.isNumber(null)).toBeFalsy()
      expect(helper.isNumber({})).toBeFalsy()
      expect(helper.isNumber([])).toBeFalsy()
    })
  })

  describe('isArray', () => {
    test('should works', () => {
      expect(helper.isArray('')).toBeFalsy()
      expect(helper.isArray(0)).toBeFalsy()
      expect(helper.isArray(true)).toBeFalsy()
      expect(helper.isNumber(null)).toBeFalsy()
      expect(helper.isArray({})).toBeFalsy()
      expect(helper.isArray([])).toBeTruthy()
    })
  })

  describe('isEmpty', () => {
    test('should works', () => {
      expect(helper.isEmpty('')).toBeTruthy()
      expect(helper.isEmpty('0')).toBeFalsy()
      expect(helper.isEmpty(0)).toBeTruthy()
      expect(helper.isEmpty(1)).toBeFalsy()
      expect(helper.isEmpty(true)).toBeFalsy()
      expect(helper.isEmpty(null)).toBeTruthy()
      expect(helper.isEmpty({})).toBeTruthy()
      expect(helper.isEmpty([])).toBeTruthy()
    })
  })

  describe('isFunction', () => {
    test('should works', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(helper.isFunction(function () {})).toBeTruthy()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(helper.isFunction(() => {})).toBeTruthy()
      expect(helper.isFunction('')).toBeFalsy()
      expect(helper.isFunction(0)).toBeFalsy()
      expect(helper.isFunction(true)).toBeFalsy()
      expect(helper.isFunction(null)).toBeFalsy()
      expect(helper.isFunction({})).toBeFalsy()
      expect(helper.isFunction([])).toBeFalsy()
    })
  })

  describe('sumBy', () => {
    test('should support sum by key in string', () => {
      const data = [
        { value: new Decimal(1) },
        { value: new Decimal(2) },
        { value: new Decimal(3) },
      ]
      expect(helper.sumBy(data, 'value')).toEqual(new Decimal(6))
    })

    test('should support sum by function', () => {
      const data = [
        { value: new Decimal(1) },
        { value: new Decimal(2) },
        { value: new Decimal(3) },
      ]
      expect(helper.sumBy(data, (v) => v.value)).toEqual(new Decimal(6))
    })
  })

  describe('reverse', () => {
    test('should support array', () => {
      expect(helper.reverse([1, 2, 3])).toEqual([3, 2, 1])
    })

    test('should support buffer', () => {
      expect(helper.reverse(Buffer.from([1, 2, 3]))).toEqual(Buffer.from([3, 2, 1]))
    })
  })

  describe('isHex', () => {
    test('should return true if string is HEX string', () => {
      expect(helper.isHex('0x0123456789ABCDEF')).toBeTruthy()
      expect(helper.isHex('0123456789ABCDEF')).toBeTruthy()
    })

    test('should return false if string is not HEX string', () => {
      expect(helper.isHex('x0123456789ABCDEF')).toBeFalsy()
    })
  })

  describe('padHexPrefix', () => {
    test('should pad 0x prefix if not exists', () => {
      expect(helper.padHexPrefix('0x12345')).toBe('0x12345')
      expect(helper.padHexPrefix('12345')).toBe('0x12345')
    })
  })

  describe('stripHexPrefix', () => {
    test('should strip 0x prefix if exists', () => {
      expect(helper.stripHexPrefix('0x12345')).toBe('12345')
      expect(helper.stripHexPrefix('12345')).toBe('12345')
    })
  })

  describe('hexToBuffer', () => {
    test('should convert hex string to buffer', () => {
      expect(helper.hexToBuffer('0xFFFF')).toEqual(Buffer.from([255, 255]))
      expect(helper.hexToBuffer('FFFF')).toEqual(Buffer.from([255, 255]))
    })
  })

  describe('bufferToHex', () => {
    test('should convert buffer to 0x prefixed hex string', () => {
      expect(helper.bufferToHex(Buffer.from([255, 255]))).toEqual('0xffff')
    })
  })

  describe('isValidMnemonic', () => {
    test('should return true if length of mnemonic is greater than or equal to 12 and is a multiple of 3', () => {
      expect(helper.isValidMnemonic('mass spike inhale claw comfort will betray birth range energy wrestle end')).toBeTruthy()
      expect(helper.isValidMnemonic('price quit crop senior tuition excess pair average vendor indoor just ecology base prevent action spatial sword illegal minor movie fatal fortune frown genius')).toBeTruthy()
    })

    test('should return true if checksum of mnemonic is wrong', () => {
      expect(helper.isValidMnemonic('mass spike inhale claw comfort will betray birth range energy wrestle test')).toBeTruthy()
    })

    test('should return false if length of mnemonic is less than or equal to 12 or is not a multiple of 3', () => {
      expect(helper.isValidMnemonic('mass spike inhale claw comfort will betray birth range energy wrestle end test')).toBeFalsy()
      expect(helper.isValidMnemonic('mass spike inhale claw comfort will betray birth range energy wrestle')).toBeFalsy()
    })
  })

  describe('isValidMnemonicChecksum', () => {
    test('should return true if checksum is correct', () => {
      expect(helper.isValidMnemonicChecksum('mass spike inhale claw comfort will betray birth range energy wrestle end')).toBeTruthy()
    })

    test('should return false if checksum is wrong', () => {
      expect(helper.isValidMnemonicChecksum('mass spike inhale claw comfort will betray birth range energy wrestle test')).toBeFalsy()
    })

    test('should return null if mnemonic is invalid', () => {
      expect(helper.isValidMnemonicChecksum('mass spike inhale')).toBeNull()
    })
  })

  describe('generateMnemonic', () => {
    test('should generate mnemonic with specific language and length', () => {
      let ret
      ret = helper.generateMnemonic('en', 12).split(' ')
      expect(ret).toEqual(expect.arrayContaining([expect.stringMatching(/^[a-z]+$/i)]))
      expect(ret.length).toEqual(12)

      ret = helper.generateMnemonic('zh-Hans', 24).split(' ')
      expect(ret).toEqual(expect.arrayContaining([expect.stringMatching(/^[\u4e00-\u9fa5]+$/i)]))
      expect(ret.length).toEqual(24)
    })

    test('should throw error 14 if language is not supported', () => {
      expect(() => {
        helper.generateMnemonic('not-exists', 12)
      }).toThrowOneChainError(14)
    })

    test('should throw error 15 if length of mnemonic is invalid', () => {
      expect(() => {
        helper.generateMnemonic('en', 13)
      }).toThrowOneChainError(15)
    })
  })

  describe('mnemonicToSeed',  () => {
    test('should convert mnemonic to seed', async () => {
      const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
      const seed = await helper.mnemonicToSeed(mnemonic)
      expect(seed).toBe('a2a1d99f9369ec56854bce6e319f84a4f1a2b67d9a93d848693bafb427f57b0bae205c599b50d56d587d5c72a39c764cc8c79646ea4220075979b0fd2cdf81cd')
    })
  })

  describe('mnemonicToSeedSync', () => {
    test('should convert mnemonic to seed', () => {
      const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
      const seed = helper.mnemonicToSeedSync(mnemonic)
      expect(seed).toBe('a2a1d99f9369ec56854bce6e319f84a4f1a2b67d9a93d848693bafb427f57b0bae205c599b50d56d587d5c72a39c764cc8c79646ea4220075979b0fd2cdf81cd')
    })
  })

  describe('deriveFromMnemonic', () => {
    test('should derive keypair from mnemonic', async () => {
      const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
      const keypair = await helper.deriveFromMnemonic(mnemonic, `m/44'/60'/0'/0/0`)

      expect(keypair).toEqual(expect.objectContaining({
        publicKey: expect.any(Buffer),
        privateKey: expect.any(Buffer)
      }))
      expect(keypair.publicKey.toString('hex')).toBe('031c8b4ca0767d6b05ad8fec51fbb1e875536ebb027e0c62b91f5161d566df9eb3')
      expect(keypair.privateKey.toString('hex')).toBe('5cdc3219476fc4598ce3116b9fa1e891164ee60ee040b99f55d04eef4a2659fd')
    })

    test('should throw error 22 if path is invalid', async () => {
      const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
      await expect(helper.deriveFromMnemonic(mnemonic, `m/xx/x/0'`)).rejects.toBeOneChainError(22)
    })
  })

  describe('deriveFromMnemonicSync', () => {
    test('should derive keypair from mnemonic', () => {
      const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
      const keypair = helper.deriveFromMnemonicSync(mnemonic, `m/44'/60'/0'/0/0`)

      expect(keypair).toEqual(expect.objectContaining({
        publicKey: expect.any(Buffer),
        privateKey: expect.any(Buffer)
      }))
      expect(keypair.publicKey.toString('hex')).toBe('031c8b4ca0767d6b05ad8fec51fbb1e875536ebb027e0c62b91f5161d566df9eb3')
      expect(keypair.privateKey.toString('hex')).toBe('5cdc3219476fc4598ce3116b9fa1e891164ee60ee040b99f55d04eef4a2659fd')
    })

    test('should throw error 2 if path is invalid', () => {
      expect(() => {
        const mnemonic = 'suggest deputy success odor venture gauge change atom envelope spawn defy exist'
        helper.deriveFromMnemonicSync(mnemonic, `m/xx/x/0'`)
      }).toThrowOneChainError(22)
    })
  })

  describe('binaryStringToBuffer', () => {
    test('should return buffer directly', () => {
      const ret = helper.binaryStringToBuffer(Buffer.alloc(10))
      expect(ret instanceof Buffer).toBeTruthy()
      expect(ret.toString('hex')).toBe('00000000000000000000')
    })

    test('should parse hex string with hex encoding', () => {
      const ret = helper.binaryStringToBuffer('0x74657374')
      expect(ret instanceof Buffer).toBeTruthy()
      expect(ret.toString('hex')).toBe('74657374')
    })

    test('should parse other string with utf8 encoding', () => {
      const ret = helper.binaryStringToBuffer('test')
      expect(ret instanceof Buffer).toBeTruthy()
      expect(ret.toString('utf8')).toBe('test')
    })
  })

  describe('binaryStringToHex', () => {
    test('should encode buffer to 0x prefixed string', () => {
      const ret = helper.binaryStringToHex(Buffer.from('test'))
      expect(ret).toBe('0x74657374')
    })

    test('should return hex string directly', () => {
      const ret = helper.binaryStringToHex('0x74657374')
      expect(ret).toBe('0x74657374')
    })

    test('should convert utf8 string to hex string', () => {
      const ret = helper.binaryStringToHex('test')
      expect(ret).toBe('0x74657374')
    })
  })
})
