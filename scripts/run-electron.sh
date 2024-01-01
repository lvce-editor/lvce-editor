#!/bin/bash

cd $(dirname "$0")
cd ..

export FOLDER="$PWD/playground"
export DEV="1"

if [[ "$OSTYPE" == "darwin"* ]]; then
  ELECTRON="node_modules/electron/dist/Electron.app/Contents/MacOS/Electron"
else
  ELECTRON="node_modules/electron/dist/electron"
fi

cd packages/main-process && "$ELECTRON" . "$@"
