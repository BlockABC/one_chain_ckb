/**
 * Basic build config
 */
module.exports = async function (env, argv, { ROOT, SRC, DIST }) {
  return {
    context: ROOT,
    resolve: {
      symlinks: true,
      extensions: ['.js', '.json'],
    },
    optimization: {
      minimize: false,
    },
    devtool: false,
    stats: {
      // Suppress warnings come from dependencies
      warnings: false
    },
    watchOptions: {
      // Delay a little more, beause building is base on typescript compiling which may trigger building multiple times.
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            /packages\/.+?\/esm/,
            /node_modules/,
          ],
          use: {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: [
                [
                  '@babel/env',
                  {
                    useBuiltIns: 'entry',
                    corejs: 3,
                    targets: [
                      "node 10",
                      "ios 12",
                      "android > 44",
                      "last 2 versions and > 1% and not ie > 0"
                    ],
                  },
                ],
              ]
            },
          },
        },
      ],
    },
    plugins: [],
  }
}
