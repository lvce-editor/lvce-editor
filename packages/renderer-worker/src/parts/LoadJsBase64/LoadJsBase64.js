import * as AssetDir from '../AssetDir/AssetDir.js'

export const loadJsBase64 = () => {
  const url = `${AssetDir.assetDir}/js/js-base64.js`
  return import(url)
}
