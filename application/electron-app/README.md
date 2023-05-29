# Setup

Create a .env file under the electron-app directory.

## Cesium Ion Access Token

Obtain a Cesium ion access token from the following website.

https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md#21-%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E5%8F%8A%E3%81%B3%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88id

Add the following to .env:

```
CESIUM_ION_TOKEN='<Cesium Ion Access Token>'
```

## Settings for Photorealistic 3D Tiles Terrain (optional)

Add the following to .env:

```
TERRAIN_TILESET_URL='https://tile.googleapis.com/v1/3dtiles/root.json?key=<Your API Key>'
```

# Build

## Install dependencies

```
cd application/electron-app
npm install --prefix ../../library/spirare-server
npm install --prefix ../../library/spirare-babylonjs
npm install
```

## Start application

```
npm run start
```

## Build application

### for Windows

```
npm run package:win
```

### for MacOS

```
npm run package:mac
```
