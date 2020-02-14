const path = require('path')

const ROOT = path.dirname(path.dirname(__dirname))
const DIST = path.resolve(ROOT, 'packages', 'pack', 'dist')

require('dotenv').config({ path: path.join(ROOT, '.env') })

module.exports = {
  ROOT,
  DIST,
}
