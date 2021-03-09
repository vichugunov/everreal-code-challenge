const devUrl = `http://localhost:8080`

module.exports = (env) => {
  if (env.env === 'dev') return devUrl

  console.error('not defined entry for env!', env.env)
  return 'not defined'
}
