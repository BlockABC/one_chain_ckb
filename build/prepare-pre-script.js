const { execSync } = require('child_process')

const CONFIG = {
  preset: 'angular',
  tagPrefix: 'prepare-v',
  commitPath: '.',
  changelogPath: 'CHANGELOG.md',
}

let recommendedVersion

// Get recommended bump
try {
  const ret = execSync(`conventional-recommended-bump -p ${CONFIG.preset} -t "${CONFIG.tagPrefix}" --commit-path .`)
  recommendedVersion = ret.toString('utf8')
}
catch (err) {
  console.error(err.message)
  process.exit(1)
}

// Bump packages' versions
try {
  execSync(`npm --no-git-tag-version version ${recommendedVersion}`)
  console.log(`Bump version: ${recommendedVersion}`)
}
catch (err) {
  console.error(err.message)
  process.exit(1)
}

// Update packages' changelogs
try {
  console.log(`conventional-changelog -p ${CONFIG.preset} -s -i CHANGELOG.md -t "${CONFIG.tagPrefix}" --commit-path .`)
  execSync(`conventional-changelog -p ${CONFIG.preset} -s -i CHANGELOG.md -t "${CONFIG.tagPrefix}" --commit-path .`)
  console.log('Update changelog.')
}
catch (err) {
  console.error(err.message)
  process.exit(1)
}
