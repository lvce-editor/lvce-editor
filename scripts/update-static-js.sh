#!/bin/bash

cd $(dirname "$0")
cd ..


download_dependencies(){
  PACKAGE_NAME=$1
  NEW_IMPORTS=$(cat static/js/$PACKAGE_NAME.js | grep -w "import")
  while IFS= read -r line ; do
    if [ -z "$line" ]
    then
      continue
    fi
    NEW_IMPORT_PACKAGE_NAME=$(echo $line | sed -r 's/^import (.+) from "\/-\/(.+)@(.+)";/\2/' )
    NEW_IMPORT_HASH=$(echo $line | sed -r 's/^import (.+) from "\/-\/(.+)@(.+)";/\3/' )
    NEW_IMPORT_URL="https://cdn.skypack.dev/-/$NEW_IMPORT_PACKAGE_NAME@$NEW_IMPORT_HASH"
    curl $NEW_IMPORT_URL > static/js/$NEW_IMPORT_PACKAGE_NAME.js
    sed -i "s~\/\-\/$NEW_IMPORT_PACKAGE_NAME@$NEW_IMPORT_HASH~\.\/$NEW_IMPORT_PACKAGE_NAME.js~" static/js/$PACKAGE_NAME.js
    download_dependencies $NEW_IMPORT_PACKAGE_NAME
  done <<< "$NEW_IMPORTS"
}

download_pkg(){
  PACKAGE_NAME=$1
  PACKAGE_VERSION=$2
  NEW_URL="https://cdn.skypack.dev$(curl https://cdn.skypack.dev/$PACKAGE_NAME@$PACKAGE_VERSION | grep "export \*" | sed -r "s/export \* from '(.*)';/\1/")"
  mkdir -p static/js
  curl $NEW_URL > static/js/$PACKAGE_NAME.js
  download_dependencies $PACKAGE_NAME
}

download_css(){
  PACKAGE_NAME=$1
  PACKAGE_VERSION=$2
  CSS_PATH=$3
  mkdir -p static/lib-css
  curl https://cdn.skypack.dev/$PACKAGE_NAME@$PACKAGE_VERSION/$CSS_PATH > static/lib-css/$PACKAGE_NAME.css
}

download_file(){
  PACKAGE_NAME=$1
  URL=$2
  mkdir -p static/js
  curl $URL > static/js/$PACKAGE_NAME.js
}

rm -rf static/js/*
rm -rf static/lib-css/*

download_pkg "ky" "0.31.0"
download_pkg "p-min-delay" "4.0.1"
download_pkg "pretty-bytes" "6.0.0"
download_file "js-base64" "https://unpkg.com/js-base64@3.7.2/base64.mjs"
download_pkg "blob-util" "2.0.2"
download_pkg "termterm" "0.0.22"
download_css "termterm" "0.0.22" "css/termterm.css"
download_css "modern-normalize" "1.1.0" "modern-normalize.css"

mkdir -p static/js/idb
download_file "idb/index" "https://unpkg.com/idb@7.0.2/build/index.js"
download_file "idb/wrap-idb-value" "https://unpkg.com/idb@7.0.2/build/wrap-idb-value.js"
