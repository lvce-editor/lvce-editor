import * as Origin from '../Origin/Origin.js'

export const getWebAssetUrl = (assetDir, fileName, origin = Origin.origin) => {
  const normalizedAssetDir = assetDir.endsWith('/') ? assetDir.slice(0, -1) : assetDir
  const assetPath = `${normalizedAssetDir}/${fileName}`
  const baseOrigin = origin || 'http://localhost'
  return new URL(assetPath, `${baseOrigin}/`).toString()
}
