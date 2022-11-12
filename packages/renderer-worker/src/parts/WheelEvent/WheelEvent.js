import * as Platform from '../Platform/Platform.js'

export const normalizeDelta = (delta) => {
  if (Platform.isFirefox) {
    return delta * (52 / 114)
  }
  return delta
}
