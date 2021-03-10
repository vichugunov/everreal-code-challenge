const path = require('path')

const localesPrefix = 'assets/locales'
const outputPath = path.resolve(__dirname, '../', 'dist')
const publicPath = path.resolve(__dirname, '../public')

const paths = {
  outputPath,
  loginEntry: path.resolve(__dirname, '../src', 'login.ts'),
  gameEntry: path.resolve(__dirname, '../src', 'game.ts'),
  carouselEntry: path.resolve(__dirname, '../src', 'carousel.ts'),
  srcPath: path.resolve(__dirname, '../src'),
  assetPath: path.resolve(__dirname, '../src', 'assets'),
  publicPath,
  localesSrcPath: path.resolve(publicPath, localesPrefix),
  localesDstPath: path.resolve(outputPath, localesPrefix),
}

module.exports = paths
