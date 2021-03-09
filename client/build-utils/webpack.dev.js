const commonPaths = require('./common-paths')

module.exports = env => {
  return {
    mode: 'development',
    resolve: {
      modules: ['node_modules']
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      hot: true,
      open: true,
      overlay: true,
      port: 8000,
      stats: {
        normal: true
      },
      contentBase: [commonPaths.publicPath]
    },
    devtool: 'inline-source-map'
  }
}
