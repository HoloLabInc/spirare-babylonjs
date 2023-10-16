const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
const webIfcWasm = 'node_modules/spirare-babylonjs/node_modules/web-ifc/'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())

require('dotenv').config()

const outputPath = path.join(__dirname, 'dist')
const clientOutputPath = path.join(__dirname, 'public', 'dist')

const serverConfig = {
  target: 'electron-main',
  entry: './src-server/index.ts',
  output: {
    path: outputPath,
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.server.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
}

const clientConfig = {
  context: __dirname,
  entry: './src-client/editor.ts',
  output: {
    path: clientOutputPath,
    filename: 'editor.js',
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource),
      react: path.resolve('./node_modules/react'),
      i18next: path.resolve('./node_modules/i18next'),
      'react-i18next': path.resolve('./node_modules/react-i18next'),
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
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.client.json',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader'],
      },
      /*
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
      */
    ],
  },
  plugins: [
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
        { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
        { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
        { from: path.join(webIfcWasm, 'web-ifc-mt.wasm') },
        { from: path.join(webIfcWasm, 'web-ifc.wasm') },
      ],
    }),
    new webpack.DefinePlugin({
      CESIUM_ION_TOKEN: JSON.stringify(process.env.CESIUM_ION_TOKEN ?? ''),
      TERRAIN_TILESET_URL: JSON.stringify(process.env.TERRAIN_TILESET_URL ?? ''),
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('dist'),
    }),
    // Suppress the following error:
    // WARNING in ../../library/spirare-babylonjs/node_modules/web-ifc/web-ifc-api.js 19:11-21
    // Critical dependency: the request of a dependency is an expression
    new webpack.ContextReplacementPlugin(
      /spirare-babylonjs[\/\\]node_modules[\/\\]web-ifc/,
      /^$/
    ),
  ],
}

const eighthwallConfig = { ...clientConfig }
eighthwallConfig.entry = './src-client/8thwallView.ts'
eighthwallConfig.output = {
  path: clientOutputPath,
  filename: '8thwallView.js',
}

const artoolkitConfig = {
  ...clientConfig,
  entry: './src-client/artoolkitView.ts',
  output: {
    path: clientOutputPath,
    filename: 'artoolkitView.js',
  }
}

artoolkitConfig.plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      { from: path.join(__dirname, 'node_modules', '@ar-js-org', 'artoolkit5-js', 'dist', 'ARToolkit.js') },
      { from: path.join(__dirname, 'data', 'artoolkit'), to: 'artoolkit' },
    ],
  })
)

const startpageConfig = {
  context: __dirname,
  entry: './src-client/startpage.tsx',
  output: {
    path: clientOutputPath,
    filename: 'startpage.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { path: false, crypto: false, fs: false },
    alias: {
      react: path.resolve('./node_modules/react'),
      i18next: path.resolve('./node_modules/i18next'),
      'react-i18next': path.resolve('./node_modules/react-i18next'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.client.json',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader'],
      },
      /*
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
      */
    ],
  },
}
module.exports = [serverConfig, clientConfig, eighthwallConfig, startpageConfig, artoolkitConfig]
