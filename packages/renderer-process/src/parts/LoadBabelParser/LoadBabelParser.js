import * as AssetDir from '../AssetDir/AssetDir.js'

export const loadBabelParser = () => {
  const url = `${AssetDir.assetDir}/js/babel-parser.js`
  return import(url)
}
