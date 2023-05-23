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

const isDev = process.env.NODE_ENV === 'development'
const noWatch = process.env.NO_WATCH === 'true'
const watchFlag = !noWatch && isDev

const common = {
  mode: isDev ? 'development' : 'production',
  watch: watchFlag,
  devtool: isDev ? 'inline-source-map' : undefined,
  cache: watchFlag,
}

const mainConfig = {
  ...common,
  target: 'electron-main',
  entry: './src/main/main.ts',
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
            configFile: 'tsconfig.main.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
}
const preloadConfig = {
  ...common,
  target: 'electron-preload',
  entry: './src/preload.ts',
  output: {
    path: outputPath,
    filename: 'preload.js',
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
            configFile: 'tsconfig.main.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
}
const rendererConfig = {
  ...common,
  devtool: 'eval-source-map',
  context: __dirname,
  target: 'electron-renderer',
  entry: './src/renderer.ts',
  output: {
    path: outputPath,
    filename: 'renderer.js',
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
    fallback: { path: false, crypto: false, fs: false },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
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
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('dist'),
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
}
const startpageConfig = {
  ...common,
  devtool: 'eval-source-map',
  context: __dirname,
  target: 'electron-renderer',
  entry: './src/startpage.tsx',
  output: {
    path: outputPath,
    filename: 'startpage.js',
  },
  resolve: {
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
module.exports = [mainConfig, preloadConfig, rendererConfig, startpageConfig]
