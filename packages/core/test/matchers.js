const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

const Decimal = core.Decimal

expect.extend({
  /**
   * OneChainError Matcher
   *
   * @param {Function} received
   * @param {number} expected
   * @returns {{pass: *, message: (function(): string)}}
   */
  toThrowOneChainError (received, expected) {
    let pass = false
    let message = `Expected OneChainError:${expected} to be thrown`

    try {
      received()
    }
    catch (err) {
      if (err.name === 'OneChainError') {
        if (err.code === expected) {
          pass = true
        }
        else {
          message = `Expected OneChainError:${err.code} to be OneChainError:${expected}`
        }
      }
      else {
        message = `Expected Error:${err.message} to be OneChainError:${expected}`
      }
    }

    return { pass, message: () => message }
  },
  /**
   * OneChainError Promises Matcher
   *
   * Example:
   * test('message', async () => {
   *   await expect(asyncFn()).rejects.toBeOneChainError(1)
   * })
   *
   * @param {Error} received
   * @param {number} expected
   * @returns {{pass: *, message: (function(): string)}}
   */
  toBeOneChainError (received, expected) {
    const err = received
    let pass = false
    let message = ''

    if (err.name === 'OneChainError') {
      if (err.code === expected) {
        pass = true
      }
      else {
        message = `Expected OneChainError:${err.code} to be OneChainError:${expected}`
      }
    }
    else {
      message = `Expected Error:${err.message} to be OneChainError:${expected}`
    }

    return { pass, message: () => message }
  },
  /**
   * UTXOTransaction Matcher
   *
   * Example:
   *
   *
   * @param received
   * @param expected
   * @returns {{pass: boolean}}
   * @constructor
   */
  UTXOTransaction (received, expected) {
    const matcher = Object.assign({
      value: expect.any(String),
      change: expect.any(String),
      fee: expect.any(String),
      waste: expect.any(String),
      size: expect.any(String),
      rawTransaction: expect.any(String),
      inputs: expect.arrayContaining([
        expect.objectContaining({
          txId: expect.any(String),
          address: expect.any(String),
          vout: expect.any(Number),
          value: expect.any(Decimal),
        })
      ]),
      outputs: expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          value: expect.any(Decimal),
        })
      ]),
    }, expected)

    expect(received).toEqual(expect.objectContaining(matcher))

    return { pass: true }
  },
  /**
   * HDWallet Matcher
   *
   * Example:
   * expect(hdwallet).toEqual(expect.HDWallet({
   *   mnemonic: MNEMONIC.word, // You may custom the field with specific value
   *   path: MNEMONIC.path,
   * }))
   *
   * @param received
   * @param expected
   * @returns {{pass: boolean}}
   * @constructor
   */
  HDWallet (received, expected) {
    const matcher = Object.assign({
      mnemonic: expect.any(String),
      path: expect.any(String),
      receiving: expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ]),
      change: expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          address: expect.any(String),
          txCount: expect.any(Number),
          balance: expect.any(String),
          ecpair: expect.anything()
        })
      ])
    }, expected)

    expect(received).toEqual(expect.objectContaining(matcher))

    return { pass: true }
  },
  /**
   * Decimal Matcher
   *
   * This is a Asymmetric Matcher, use it like `expect.any( ... )`
   *
   * @param {string} received Received Decimal will by stringify, so here is string type.
   * @param {Decimal.Value} expected
   * @returns {{pass: *, message: (function(): string)}}
   * @constructor
   */
  Decimal (received, expected) {
    let pass = false
    let message = ''

    received = new Decimal(received)
    expected = new Decimal(expected)

    pass = received.equals(expected)
    if (!pass) {
      message = `Decimal<${received.toString()}> is not equal Decimal<${expected.toString()}>`
    }

    return { pass, message: () => message }
  }
})
