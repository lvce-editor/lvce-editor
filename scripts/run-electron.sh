#!/bin/bash

cd $(dirname "$0")
cd ..

export FOLDER="$PWD/playground"
export DEV="1"

cd packages/main-process && node_modules/electron/dist/electron . "$@"
