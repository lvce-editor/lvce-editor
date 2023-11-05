import * as AssetDir from '../AssetDir/AssetDir.js'

export const loadMarked = async () => {
  const url = `${AssetDir.assetDir}/js/marked.js`
  const module = await import(url)
  return module.marked
}
