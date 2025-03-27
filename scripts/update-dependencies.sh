#!/bin/bash

set -e

cd $(dirname "$0")
cd ..

command_exists(){
  command -v "$1" &> /dev/null
}

if ! command_exists "ncu"; then
    echo "npm-check-updates is not installed"
    npm i -g npm-check-updates
else
    echo "ncu is installed"
fi

function updateDependencies {
  echo "updating dependencies..."
  OUTPUT=`ncu -u -x msw -x @types/node -x rollup -x electron-unhandled -x electron -x execa -x electron-builder`
  SUB='All dependencies match the latest package versions'
  if [[ "$OUTPUT" == *"$SUB"* ]]; then
    echo "$OUTPUT"
  else
    rm -rf node_modules package-lock.json dist
    npm install
  fi
}

                                                       updateDependencies             &&
cd packages/build                                   && updateDependencies && cd ../.. &&
cd packages/debug-worker                            && updateDependencies && cd ../.. &&
cd packages/extension-host-helper-process           && updateDependencies && cd ../.. &&
cd packages/extension-host-worker-tests             && updateDependencies && cd ../.. &&
cd packages/main-process                            && updateDependencies && cd ../.. &&
cd packages/renderer-worker                         && updateDependencies && cd ../.. &&
cd packages/server                                  && updateDependencies && cd ../.. &&
cd packages/shared-process                          && updateDependencies && cd ../.. &&
cd packages/static-server                           && updateDependencies && cd ../.. &&


echo "Great Success!"

sleep 2