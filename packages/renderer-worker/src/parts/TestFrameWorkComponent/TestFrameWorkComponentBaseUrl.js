import * as Platform from '../Platform/Platform.js'

export const getBaseUrl = () => {
  return `${location.origin}/${Platform.getAssetDir()}`
}
