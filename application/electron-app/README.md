This is a desktop application which allows you to edit 3D content for Spirare.  
The edited 3D content is saved as a POML file.

<img width="480" alt="Spirare Editor Space Mode" src="https://user-images.githubusercontent.com/4415085/234750272-4cf344c9-7eee-40d3-a011-a8910c1cd478.jpg"></img>  
Edit page in space mode

<img width="480" alt="Spirare Editor Geo Mode" src="https://user-images.githubusercontent.com/4415085/235422239-6542d04b-b4b3-4303-abef-bc6b4297dd87.png"></img>  
Edit page in geo mode

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

# Usage

## Edit 3D content

Create a new scene or open an existing scene.

Please drag and drop 3D models (.glb), images (.jpg, .png, .gif), and videos (.mp4) into the app window.
Afterwards, please adjust the position, rotation, and scale using the GUI.

<img width="480" alt="Spirare Editor Geo Mode" src="https://github.com/HoloLabInc/spirare-babylonjs/assets/4415085/45ed7026-b01a-41f1-9e7f-363314be24a1"></img>

## View 3D content with AR

To display POML in AR, please use the Spirare Browser app.
Spirare Browser app can be built from the following repository.  
https://github.com/HoloLabInc/ProjectSpirare-for-Unity

There are two methods to deliver POML data to the Spirare Browser app: via network and file.

### Network Loading

Connect your PC and AR device to the same network, and make sure they can communicate.

Keep the editor application in the scene editing screen display mode. In this state, you can load POML content from `http://<PC's IP address>:8080`.

### File Loading

Press the Export button in the upper menu of editor, and download the `.poml.zip` file. Please place this file on the AR device. For the placement location, refer to the README of the Spirare Browser.
