import * as AssetDir from '../AssetDir/AssetDir.js'

/**
 *
 * @returns {Promise<import('../../../../../static/js/ky.js',  { assert: { "resolution-mode": "import" } } )>}
 */
export const loadKy = async () => {
  const url = `${AssetDir.assetDir}/js/ky.js`
  const module = await import(url)
  return module
}
