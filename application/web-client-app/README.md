# Setup

Create a .env file under the web-client-app directory.

## Cesium Ion Access Token

Obtain a Cesium ion access token from the following website.

https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md#21-%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E5%8F%8A%E3%81%B3%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88id

Add the following to .env:

```
CESIUM_ION_TOKEN='<Cesium Ion Access Token>'
```

# Start server
```
npm install
npm run start
```