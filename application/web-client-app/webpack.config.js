const cesiumSource = 'node_modules/spirare-babylonjs/node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
const webIfcWasm = 'node_modules/spirare-babylonjs/node_modules/web-ifc/'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const glob = require('glob')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const appDirectory = fs.realpathSync(process.cwd())

require('dotenv').config()

const webpackConfig = {
  context: __dirname,
  entry: {},
  output: {
    filename: 'js/[name].js', //name for the js file that is created/compiled in memory
    clean: true,
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource),
    },
    mainFiles: ['index', 'Cesium'],
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      path: false,
      crypto: false,
      fs: false,
      zlib: false,
      http: false,
      https: false,
      url: false,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080, //port that we're using for local host (localhost:8080)
    static: path.resolve(appDirectory, 'public'), //tells webpack to serve from the public folder
    hot: true,
    devMiddleware: {
      publicPath: '/',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader'],
      },
    ],
  },
  plugins: [
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
        { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
        { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
        { from: path.join(webIfcWasm, 'web-ifc-mt.wasm'), to: 'js' },
        { from: path.join(webIfcWasm, 'web-ifc.wasm'), to: 'js' },
      ],
    }),
    new webpack.DefinePlugin({
      CESIUM_ION_TOKEN: JSON.stringify(process.env.CESIUM_ION_TOKEN ?? ''),
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('.'),
      TERRAIN_TILESET_URL: JSON.stringify(process.env.TERRAIN_TILESET_URL ?? ''),
    }),

    // Suppress the following error:
    // WARNING in ../../library/spirare-babylonjs/node_modules/web-ifc/web-ifc-api.js 19:11-21
    // Critical dependency: the request of a dependency is an expression
    new webpack.ContextReplacementPlugin(
      /spirare-babylonjs[\/\\]node_modules[\/\\]web-ifc/,
      /^$/
    ),
  ],
  mode: 'development',
}

glob
  .sync('**/*.ts', {
    cwd: 'src',
  })
  .forEach((jsName) => {
    if (jsName.endsWith('d.ts')) {
      return
    }
    webpackConfig.entry[jsName] = path.resolve('src', jsName)

    const templateName = path.basename(jsName, '.ts') + '.html'
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(appDirectory, 'public', templateName),
        filename: templateName,
        inject: 'body',
        includeSiblingChunks: true,
        chunks: ['vendor.js', jsName],
      })
    )
  })

module.exports = webpackConfig
