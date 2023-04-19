# Setup

Create a .env file under the server-client-app directory.

## Cesium Ion Access Token

Obtain a Cesium ion access token from the following website.

https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md#21-%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E5%8F%8A%E3%81%B3%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88id

Add the following to .env:

```
CESIUM_ION_TOKEN='<Cesium Ion Access Token>'
```

## User ID for local execution

Add the following to .env:

```
DUMMY_USER_ID='testuser'
```

## Information for Azure Files (optional)

Add the following to .env:

```
AZURE_FILES_ACCOUNT_NAME='<account name>'
AZURE_FILES_ACCOUNT_KEY='<account key>'
AZURE_FILES_SHARE_NAME='<share name>'
```

## Settings for 8th Wall (optional)

### Creating an SSL key

Create an `ssl` folder under the `server-client-app` directory and place `server.cert` and `server.key` in it.

Generating a key using openssl:
```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

### Setting up .env

Add the following to .env:

```
ENABLE_HTTPS='true'
EIGHTHWALL_API_KEY='<api key>'
```

# Start server

```
npm install
npm run build
npm run serve
```