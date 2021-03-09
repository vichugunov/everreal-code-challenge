const commonPaths = require('./common-paths')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const getBaseUrl = require('./helpers/getBaseUrl')

module.exports = env => {
  return {
    entry: {
        login: commonPaths.loginEntry,
        game: commonPaths.gameEntry
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    output: {
      filename: "[name].bundle.js",
      path: commonPaths.outputPath,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s(x)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { browsers: 'last 2 versions' } },
                ],
                '@babel/preset-typescript'
              ],
            },
          },
        },
        {
          test: /\.(svg|png|jpe?g|pdf|ico)$/,
          loader: 'file-loader',
          options: {
            name:'assets/[name].[ext]',
            esModule: false
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'file-loader',
          options: {
            name:'assets/fonts/[name].[ext]',
            esModule: false
          }
        }
      ],
    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        "ApiBaseUrl": JSON.stringify(getBaseUrl(env))
      }),
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        hash: true,
        title: 'EverReal Code Challenge',
        myPageHeader: 'Login',
        template: path.resolve(commonPaths.publicPath, 'index.html'),
        filename: 'index.html',
        chunks: [ 'login' ]
      }),
      new HtmlWebpackPlugin({
        hash: true,
        title: 'EverReal Code Challenge',
        myPageHeader: 'Game',
        template: path.resolve(commonPaths.publicPath, 'game.html'),
        filename: 'game.html',
        chunks: [ 'game' ]
      })
    ],
  }
}
