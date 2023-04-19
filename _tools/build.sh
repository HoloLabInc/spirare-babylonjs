#!/bin/sh

cd "$(dirname $0)"
basedir="$(pwd)/.."

cd ${basedir}/library/spirare-babylonjs
npm ci
cd ${basedir}/library/spirare-server
npm ci
cd ${basedir}/application/web-client-app
npm ci
cd ${basedir}/application/electron-app
npm ci
cd ${basedir}/application/server-client-app
npm ci

cd ${basedir}

npm run build --prefix ${basedir}/library/spirare-babylonjs
npm run build --prefix ${basedir}/library/spirare-server
npm run build --prefix ${basedir}/application/web-client-app
npm run build --prefix ${basedir}/application/electron-app
npm run build --prefix ${basedir}/application/server-client-app
