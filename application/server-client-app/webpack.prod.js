const { merge } = require('webpack-merge')
const [
  serverConfigCommon,
  clientConfigCommon,
  startpageConfigCommon,
] = require('./webpack.common.js')

const serverConfig = merge(serverConfigCommon, {
  mode: 'production',
})

const clientConfig = merge(clientConfigCommon, {
  mode: 'production',
})

const startpageConfig = merge(startpageConfigCommon, {
  mode: 'production',
})

module.exports = [serverConfig, clientConfig, startpageConfig]
