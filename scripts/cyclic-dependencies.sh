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

cd packages/extension-host         && echo "Checking extension-host"                 && dpdm --no-warning --no-tree --exit-code circular:1 src/extensionHostMain.js  && cd ../.. &&
cd packages/main-process           && echo "Checking main-process"                   && dpdm --no-warning --no-tree --exit-code circular:1 src/mainProcessMain.js  && cd ../.. &&
cd packages/pty-host               && echo "Checking pty-host"                       && dpdm --no-warning --no-tree --exit-code circular:1 src/ptyHostMain.js  && cd ../.. &&
cd packages/renderer-process       && echo "Checking renderer-process"               && dpdm --no-warning --no-tree --exit-code circular:1 src/rendererProcessMain.js  && cd ../.. &&
cd packages/renderer-worker        && echo "Checking renderer-worker"                && dpdm --no-warning --no-tree --exit-code circular:1 src/rendererWorkerMain.js  && cd ../.. &&
cd packages/shared-process         && echo "Checking shared-process"                 && dpdm --no-warning --no-tree --exit-code circular:1 src/sharedProcessMain.js  && cd ../.. &&

echo "Great Success!"

sleep 2