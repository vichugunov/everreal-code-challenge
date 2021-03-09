const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
  ]
}