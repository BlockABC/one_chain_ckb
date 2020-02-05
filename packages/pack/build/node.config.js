const merge = require('webpack-merge')
const webpack = require('webpack')

const util = require('./util')
const baseConfigGenerator = require('./base.config')

/**
 * Build for node runtime
 */
module.exports = async function (env = {}, argv, { ROOT, SRC, DIST }) {
  const PROD = argv.mode === 'production'
  const baseConfig = await baseConfigGenerator(env, argv, { ROOT, SRC, DIST })

  return merge(baseConfig, {
    target: 'node',
    resolve: {
      mainFields: ['main', 'module'],
    },
    output: {
      library: 'onechain',
      libraryTarget: 'commonjs2',
      filename: '[name].cjs.js',
      path: DIST,
    },
    plugins: [
      new webpack.IgnorePlugin({
        /**
         * 禁用原因：
         * memcpy 需要编译，且编译并未达到对开发透明的程度
         * encoding 只有在使用 node-fetch 的 textConverted 接口时需要，但是这个库默认依赖需要编译的 iconv
         */
        resourceRegExp: /memcpy|encoding$/,
        contextRegExp: /bytebuffer|node-fetch/,
      }),
      new webpack.DefinePlugin({
        PROD: PROD,
        NODE_RUNTIME: true,
      }),
      new webpack.BannerPlugin({
        banner: util.generateBanner()
      }),
    ],
  })
}
