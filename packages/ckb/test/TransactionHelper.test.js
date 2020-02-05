const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { ckb, core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(path.dirname(path.dirname(__dirname)), 'core', 'test', 'matchers'))

const transactionHelper = ckb.transactionHelper
const Decimal = core.Decimal

describe('TransactionHelper', () => {
  describe('calcInputOutput', () => {
    describe('Default mode', () => {
      test('should support select unspents by order', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('6100000000') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('6100000000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('6100000000') }
          ],
          changes: [
            { address: 'a' }
          ],
          fee: new Decimal(0),
          autoFix: false
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('6100000000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('6100000000') },
          ],
          changes: [
            { address: 'a', value: expect.Decimal('0') },
          ],
          fee: expect.Decimal(0),
          waste: expect.Decimal('0'),
        }))
      })

      test('should add more unspents if change is not enough for MIN_CELL_CAPACITY', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('6100000001') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('6100000000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('6100000000') }
          ],
          changes: [
            { address: 'a' }
          ],
          fee: new Decimal(0),
          autoFix: false
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('6100000001') },
            { txId: '', address: 'a', vout: 2, value: expect.Decimal('6100000000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('6100000000') },
          ],
          changes: [
            { address: 'a', value: expect.Decimal('6100000001') },
          ],
          fee: expect.Decimal('0'),
          waste: expect.Decimal('0'),
        }))
      })

      test('should move change to fee if change is less than 61 CKB', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('10000000000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('19999998999') }
          ],
          changes: [
            { address: 'a', value: new Decimal('13900000000') }
          ],
          fee: new Decimal('1000'),
          autoFix: true
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: expect.Decimal('10000000000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('19999998999') }
          ],
          changes: [
            { address: 'a', value: expect.Decimal(0) }
          ],
          fee: expect.Decimal('1001'),
          waste: expect.Decimal('1'),
        }))
      })
    })

    describe('Autofix mode', () => {
      test('should calculate as default mode if balance is enough', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('103799900000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('6100000000') }
          ],
          changes: [
            { address: 'a' }
          ],
          fee: new Decimal(0),
          autoFix: true
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('103799900000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('6100000000') },
          ],
          changes: [
            { address: 'a', value: expect.Decimal('97699900000') },
          ],
          fee: expect.Decimal('0'),
          waste: expect.Decimal('0'),
        }))
      })

      test('should move change to fee if change is less than 61 CKB', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('10000000000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('19999998999') }
          ],
          changes: [
            { address: 'a', value: new Decimal('13900000000') }
          ],
          fee: new Decimal('1000'),
          autoFix: true
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: expect.Decimal('10000000000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('19999998999') }
          ],
          changes: [
            { address: 'a', value: expect.Decimal('0') }
          ],
          fee: expect.Decimal('1001'),
          waste: expect.Decimal('1'),
        }))
      })

      test('should subtract tos\'s values if needed', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('6100000000') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('6100000001') },
          ],
          tos: [
            { address: 'b', value: new Decimal('61000000001') }
          ],
          changes: [
            { address: 'a' }
          ],
          fee: new Decimal('6100000001'),
          autoFix: true
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('6100000000') },
            { txId: '', address: 'a', vout: 2, value: expect.Decimal('6100000001') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('6100000000') }
          ],
          changes: [
            { address: 'a', value: expect.Decimal('0') }
          ],
          fee: expect.Decimal('6100000001'),
          waste: expect.Decimal('0'),
        }))
      })

      test('should clear changes if tos\' value was fixed', () => {
        const ret = transactionHelper.calcInputOutput({
          unspents: [
            { txId: '', address: 'a', vout: 1, value: new Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: new Decimal('10000000000') },
          ],
          tos: [
            { address: 'b', value: new Decimal('20000000000') }
          ],
          changes: [
            { address: 'a', value: new Decimal('13900000000') }
          ],
          fee: new Decimal('1000'),
          autoFix: true
        })

        expect(ret).toEqual(expect.objectContaining({
          inputs: [
            { txId: '', address: 'a', vout: 1, value: expect.Decimal('10000000000') },
            { txId: '', address: 'a', vout: 2, value: expect.Decimal('10000000000') },
          ],
          outputs: [
            { address: 'b', value: expect.Decimal('19999999000') }
          ],
          changes: [
            { address: 'a', value: expect.Decimal('0') }
          ],
          fee: expect.Decimal('1000'),
          waste: expect.Decimal('0'),
        }))
      })

      test('should throw error 109 if balance is not enough for fee', () => {
        expect(() => {
          transactionHelper.calcInputOutput({
            unspents: [
              { txId: '', address: 'a', vout: 1, value: new Decimal('6100000000') },
              { txId: '', address: 'a', vout: 2, value: new Decimal('6100000000') },
            ],
            tos: [
              { address: 'b', value: new Decimal('61000000000') }
            ],
            changes: [
              { address: 'a' }
            ],
            fee: new Decimal('6100000001'),
            autoFix: true
          })
        }).toThrowOneChainError(109)
      })

      // test('test', () => {
      //   let ret
      //   for (let i = 1; i < 10000000000; i++) {
      //     ret = transactionHelper.calcInputOutput({
      //       unspents: [
      //         { txId: '', address: 'a', vout: 1, value: new Decimal('10000000000') },
      //         { txId: '', address: 'a', vout: 2, value: new Decimal('10000000000') },
      //       ],
      //       tos: [
      //         // { address: 'b', value: new Decimal('20000000000') }
      //         { address: 'b', value: new Decimal('20000000000').sub(i) }
      //       ],
      //       changes: [
      //         { address: 'a', value: new Decimal('13900000000') }
      //       ],
      //       fee: new Decimal('1000'),
      //       autoFix: true
      //     })
      //
      //     const output = transactionHelper.sumBy(ret.outputs, 'value').add(transactionHelper.sumBy(ret.changes, 'value'))
      //     const input = transactionHelper.sumBy(ret.inputs, 'value')
      //     if (input - output <= 0) {
      //       break
      //     }
      //     else {
      //       console.log(`${new Decimal('20000000000').sub(i).toString()}: ${input - output}`)
      //     }
      //   }
      //
      //   console.log('input:', transactionHelper.sumBy(ret.inputs, 'value').toString())
      //   console.log('output total:', transactionHelper.sumBy(ret.outputs, 'value').add(transactionHelper.sumBy(ret.changes, 'value')).toString())
      //   console.log('  output:', transactionHelper.sumBy(ret.outputs, 'value').toString())
      //   console.log('  change:', transactionHelper.sumBy(ret.changes, 'value').toString())
      //   console.log('fee:', ret.fee.toString())
      //
      //   expect(true).toBeTruthy()
      // })
    })
  })

  /* eslint-disable quotes, object-curly-spacing, key-spacing, comma-spacing */
  describe('calcFee', () => {
    test('should calculate fee', () => {
      const fee = transactionHelper.calcFee({
        inputs: [
          { txId: '0x1', vout: 0, address: 'a', value: new Decimal(0) },
          { txId: '0x2', vout: 0, address: 'a', value: new Decimal(0) },
        ],
        outputs: [
          { address: 'b', value: new Decimal(0) },
          { address: 'a', value: new Decimal(0) },
        ],
        outputsData: [
          '0x',
          '0x',
        ],
        feeRate: 1
      })

      expect(fee).toEqual(new Decimal(644))
    })
  })

  describe('estimateSize', () => {
    test('should return size correctlly', () => {
      const fee = transactionHelper.estimateSize({
        inputs: [
          { txId: '0x1', vout: 0, address: 'a', value: new Decimal(0) },
          { txId: '0x2', vout: 0, address: 'a', value: new Decimal(0) },
        ],
        outputs: [
          { address: 'b', value: new Decimal(0) },
          { address: 'a', value: new Decimal(0) },
        ],
        outputsData: [
          '0x',
          '0x',
        ],
      })

      expect(fee).toEqual(585)
    })
  })
})
