#!/bin/bash

cd $(dirname "$0")
cd ..

export FOLDER="$PWD/playground"
export DEV="1"

node packages/build/src/parts/RunElectron/RunElectron.js "$@"
