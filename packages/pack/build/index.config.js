const fs = require('fs').promises

/**
 * Combine multiple webpack config into one.
 *
 * Example:
 * Only btc.config.js: webpack --mode=production --env.analysis --env.config=btc --env.target=node --env.target=web --config build/index.config.js
 * btc.config.js + bch.config.js: webpack --mode=production --env.analysis --env.config=btc --env.target=node --env.target=web --config build/index.config.js
 * All .config.js: webpack --mode=production --env.analysis --env.target=node --env.target=web --config build/index.config.js
 */
module.exports = async function (env = {}, argv) {
  if (!Array.isArray(env.config)) {
    env.config = env.config ? [env.config] : []
  }

  const fileNames = await fs.readdir(__dirname)
  const configNames = []
  // Walk through current directory, collect all config names.
  for (const name of fileNames) {
    if (name.endsWith('config.js') && name !== 'index.config.js') {
      configNames.push(name.slice(0, -10))
    }
  }

  // Combine all configs by default
  if (env.config.length <= 0) {
    env.config = configNames
  }

  let configs = []
  // Walk through env.config, generate webpack configs.
  for (const configName of env.config) {
    if (configNames.includes(configName)) {
      const genConfig = require(`./${configName}.config`)
      configs = configs.concat(await genConfig(env, argv))
    }
  }

  return configs
}
