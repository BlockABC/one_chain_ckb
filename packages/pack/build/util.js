const path = require('path')
const del = require('del')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const pkg = require(path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'package.json'))
const REPO_DIR = path.dirname(__dirname)
const REPORTS_DIR = path.join(REPO_DIR, 'reports')

function generateBanner () {
  return `@license
One Chain CKB v${pkg.version}
Auth: ${pkg.author}`
}

function getBundleNameFromConfig (config, name) {
  const extMap = {
    'commonjs2': 'cjs',
    'umd': 'umd'
  }

  return `${name}.${extMap[config.output.libraryTarget]}`
}

async function delBundleFiles (config, name) {
  const bundleName = getBundleNameFromConfig(config, name)
  await del([`${config.output.path}/${bundleName}.*`])
}

function generateConfigWithOptimizationOn (config, name) {
  return merge(config, {
    output: {
      filename: getBundleNameFromConfig(config, name) + '.min.js',
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
          output: {
            comments: /@license/i,
          },
        },
        extractComments: false,
      })]
    },
    devtool: false,
  })
}

function shouldGenerateReport (env, config, name) {
  // 生成 bundle 分析报告
  if (env.analysis) {
    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(REPORTS_DIR, getBundleNameFromConfig(config, name) + '.report.html'),
      openAnalyzer: false
    }))
  }
}

module.exports = {
  generateBanner,
  getBundleNameFromConfig,
  delBundleFiles,
  generateConfigWithOptimizationOn,
  shouldGenerateReport,
}
