import * as Origin from '../Origin/Origin.js'

export const getWebAssetUrl = (assetDir, fileName, origin = Origin.origin) => {
  const normalizedAssetDir = assetDir.endsWith('/') ? assetDir.slice(0, -1) : assetDir
  const assetPath = `${normalizedAssetDir}/${fileName}`
  return new URL(assetPath, `${origin}/`).toString()
}
