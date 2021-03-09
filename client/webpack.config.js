const commonConfigFile = require('./build-utils/webpack.common')
const { merge: webpackMerge } = require('webpack-merge')

const addons = (addonsArg) => {
  return [].concat(addonsArg)
         .filter(Boolean) // remove undefined entries
         .map((addonName) => require(`./build-utils/addons/webpack.${addonName}.js`))
}

module.exports = (env) => {
  const envConfigFile = require(`./build-utils/webpack.${env.env}.js`)
  const mergedConfig = webpackMerge(commonConfigFile(env), envConfigFile(env), ...addons(env.addons))

  return mergedConfig
}
