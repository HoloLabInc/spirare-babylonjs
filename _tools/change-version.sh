#!/bin/sh

if [ -z "$1" ]; then
  echo 'Please specify version'
  echo './change-version.sh 1.0.0'
  exit 1
fi

cd "$(dirname $0)"
basedir="$(pwd)/.."

cd ${basedir}/library/spirare-babylonjs
npm version $1
cd ${basedir}/library/spirare-server
npm version $1
cd ${basedir}/application/web-client-app
npm version $1
cd ${basedir}/application/electron-app
npm version $1
cd ${basedir}/application/server-client-app
npm version $1

cd ${basedir}
