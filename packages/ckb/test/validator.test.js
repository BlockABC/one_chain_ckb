const path = require('path')
const packagesDir = path.dirname(path.dirname(__dirname))
const { ckb, core } = require(path.join(packagesDir, 'pack', 'dist', 'ckb.cjs'))

require(path.join(packagesDir, 'core', 'test', 'matchers'))

const validator = ckb.validator

describe('validator', () => {
  describe('IKeypair', () => {
    test('test', () => {
      validator.validate(
        'IKeypair',
        'X',
        {
          address: 'ckb1qyqdl90sykhwcp458vnns7cm9d3429s3xelqv87zzj',
          privateKey: '0xf70eea3041c793746f07d47f28a62d6555041b9edc74501a75ffbf47c55fc9'
        }
      )
      expect(true).toBeTruthy()
    })
  })
})
