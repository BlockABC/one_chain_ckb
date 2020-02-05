const path = require('path')
const merge = require('webpack-merge')

const util = require('./util')

const NAME = 'ckb.es5'
const ROOT = path.dirname(__dirname)
const SRC = path.resolve(ROOT, 'src')
const DIST = path.resolve(ROOT, 'dist')

const NODE_MODULES_DIR = path.join(path.dirname(path.dirname(ROOT)), 'node_modules')

const alias = {
  'elliptic': path.join(NODE_MODULES_DIR, 'elliptic'),
  'bn.js': path.join(NODE_MODULES_DIR, 'bn.js'),
  // 为了兼容浏览器扩展版的实现，降低构建难度，统一改为使用 js 实现
  'secp256k1': 'secp256k1/elliptic',
}

module.exports = async function (env, argv) {
  if (!Array.isArray(env.target)) {
    env.target = env.target ? [env.target] : []
  }
  let configs = []

  if (env.target.includes('web')) {
    const webConfigGenerator = require('./web.config')
    let config = await webConfigGenerator(env, argv, { NAME, ROOT, SRC, DIST })
    config = merge(config, {
      entry: {
        [NAME]: './esm/ckb.es5.js',
      },
      output: {
        filename: '[name].umd.js',
      },
      externals: {
        lodash: '_'
      },
      resolve: {
        alias,
      },
    })
    config.module.rules[0].use = {
      loader: 'babel-loader',
      options: {
        sourceType: 'unambiguous',
        presets: [
          [
            '@babel/env',
            {
              useBuiltIns: 'entry',
              corejs: 3,
            },
          ],
        ]
      },
    }
    configs.push(config)
  }

  const configsWithOptimizationOn = []
  for (const config of configs) {
    await util.delBundleFiles(config, NAME)

    if (argv.mode === 'production') {
      const configWithOptimizationOn = util.generateConfigWithOptimizationOn(config, NAME)
      configsWithOptimizationOn.push(configWithOptimizationOn)

      util.shouldGenerateReport(env, config, NAME)
    }
  }
  configs = configs.concat(configsWithOptimizationOn)

  return configs
}
