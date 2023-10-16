const { merge } = require('webpack-merge')
const [
  serverConfigCommon,
  clientConfigCommon,
  eighthwallConfigCommon,
  startpageConfigCommon,
  artoolkitConfigCommon,
] = require('./webpack.common.js')

const serverConfig = merge(serverConfigCommon, {
  mode: 'production',
})

const clientConfig = merge(clientConfigCommon, {
  mode: 'production',
})

const eighthwallConfig = merge(eighthwallConfigCommon, {
  mode: 'production',
})

const startpageConfig = merge(startpageConfigCommon, {
  mode: 'production',
})

const artoolkitConfig = merge(artoolkitConfigCommon, {
  mode: 'production',
})

module.exports = [serverConfig, clientConfig, eighthwallConfig, startpageConfig, artoolkitConfig]
