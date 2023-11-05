import * as AssetDir from '../AssetDir/AssetDir.js'

export const loadDomPurify = async () => {
  const url = `${AssetDir.assetDir}/js/dompurify.js`
  const module = await import(url)
  return module.default
}
