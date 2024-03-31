import * as AssetDir from '../AssetDir/AssetDir.ts'

/**
 *
 * @returns {Promise<any>}
 */
export const loadKy = async () => {
  const url = `${AssetDir.assetDir}/js/ky.js`
  const module = await import(url)
  return module
}
