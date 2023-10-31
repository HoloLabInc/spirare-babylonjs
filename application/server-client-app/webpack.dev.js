const { merge } = require('webpack-merge')
const [
  serverConfigCommon,
  clientConfigCommon,
  startpageConfigCommon,
] = require('./webpack.common.js')

const serverConfig = merge(serverConfigCommon, {
  mode: 'development',
})

const clientConfig = merge(clientConfigCommon, {
  devtool: 'eval-source-map',
  mode: 'development',
})

const startpageConfig = merge(startpageConfigCommon, {
  devtool: 'eval-source-map',
  mode: 'development',
})

module.exports = [serverConfig, clientConfig, startpageConfig]
