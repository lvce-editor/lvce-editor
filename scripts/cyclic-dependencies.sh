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

cd packages/extension-host                          && dpdm src/extensionHostMain.js  && cd ../.. &&
cd packages/main-process                            && dpdm src/mainProcessMain.js  && cd ../.. &&
cd packages/pty-host                                && dpdm src/ptyHostMain.js  && cd ../.. &&
cd packages/renderer-process                        && dpdm src/rendererProcessMain.js  && cd ../.. &&
cd packages/renderer-worker                         && dpdm src/rendererWorkerMain.js  && cd ../.. &&
cd packages/shared-process                          && dpdm src/sharedProcessMain.js  && cd ../.. &&

echo "Great Success!"

sleep 2