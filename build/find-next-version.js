const path = require('path')
const { execSync } = require('child_process')
const semver = require('semver')
const pkg = require(path.join(path.dirname(__dirname), 'package.json'))

const CONFIG = {
  preset: 'angular',
  tagPrefix: 'prepare-v',
}

let recommendedVersion
try {
  const ret = execSync(`conventional-recommended-bump -p ${CONFIG.preset} -t "${CONFIG.tagPrefix}"`)
  recommendedVersion = ret.toString('utf8').trim()
}
catch (err) {
  console.error(err.message)
  process.exit(1)
}

console.log(semver.inc(pkg.version, recommendedVersion))
