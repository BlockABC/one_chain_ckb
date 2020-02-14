const merge = require('webpack-merge')
const webpack = require('webpack')

const util = require('./util')
const baseConfigGenerator = require('./base.config')

/**
 * Build for web runtime
 */
module.exports = async function (env = {}, argv, { ROOT, SRC, DIST }) {
  const PROD = argv.mode === 'production'
  const baseConfig = await baseConfigGenerator(env, argv, { ROOT, SRC, DIST })

  return merge(baseConfig, {
    target: 'web',
    resolve: {
      mainFields: ['browser', 'module', 'main'],
    },
    output: {
      library: 'onechain',
      libraryTarget: 'umd',
      filename: '[name].umd.js',
      path: DIST,
    },
    plugins: [
      new webpack.DefinePlugin({
        PROD: PROD,
        NODE_RUNTIME: false,
      }),
      new webpack.BannerPlugin({
        banner: util.generateBanner()
      }),
    ]
  })
}
