module.exports = env => {
  return {
    mode: 'production',
    devtool: false,
    output: {
      publicPath: './'
    }
  }
}
