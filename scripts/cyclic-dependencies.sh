#!/bin/bash

set -e

cd $(dirname "$0")
cd ..

command_exists(){
  command -v "$1" &> /dev/null
}

if ! command_exists "dpdm"; then
    echo "dpdm is not installed"
    npm i -g dpdm
else
    echo "dpdm is installed"
fi

cd packages/main-process           && echo "Checking main-process"                   && dpdm --no-warning --no-tree --exit-code circular:1 src/mainProcessMain.js  && cd ../.. &&
cd packages/build                  && echo "Checking build"                          && dpdm --no-warning --no-tree --exit-code circular:1 src/build.js  && cd ../.. &&
cd packages/shared-process         && echo "Checking shared-process"                 && dpdm --no-warning --no-tree --exit-code circular:1 src/sharedProcessMain.js  && cd ../.. &&
cd packages/renderer-worker        && echo "Checking renderer-worker"                && dpdm --no-warning --no-tree --exit-code circular:1 src/rendererWorkerMain.ts  && cd ../.. &&

echo "Great Success!"

sleep 2