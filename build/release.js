const path = require('path')
const semanticRelease = require('semantic-release')

const ROOT = path.dirname(__dirname)

require('dotenv').config({ path: path.join(ROOT, '.env') })

;(async function () {
  try {
    const result = await semanticRelease(
      {
        dryRun: process.env.SEMANTIC_RELEASE_DRY_RUN === '1',
        ci: process.env.SEMANTIC_RELEASE_CI === '1',
        branches: [
          'master',
          { name: 'beta', prerelease: true },
          { name: 'alpha', prerelease: true },
        ],
        plugins: [
          '@semantic-release/commit-analyzer',
          '@semantic-release/release-notes-generator',
          '@semantic-release/changelog',
          // Bump version of package.json
          ['@semantic-release/npm', {
            npmPublish: false,
          }],
          // Execute staffs that ci should do
          ['@semantic-release/exec', {
            // unit test
            // verifyConditionsCmd: 'yarn run test',
            // build
            prepareCmd: 'yarn run build'
          }],
          // Commit assets
          ['@semantic-release/git', {
            // build
            assets: [
              'package.json',
              'CHANGELOG.md',
            ]
          }],
          // Create release and push to github
          ['@semantic-release/github', {
            assets: [
              ['packages/pack/dist/*.umd.js'],
              ['packages/pack/dist/*.umd.min.js'],
            ]
          }],
        ]
      },
      {
        cwd: ROOT,
      }
    )

    if (result) {
      const { lastRelease, commits, nextRelease, releases } = result

      console.log(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`)

      if (lastRelease.version) {
        console.log(`The last release was "${lastRelease.version}".`)
      }

      for (const release of releases) {
        console.log(`The release was published with plugin "${release.pluginName}".`)
      }
    }
    else {
      console.log('No release published.')
    }
  }
  catch (err) {
    console.error('The automated release failed with %O', err)
  }
})()
