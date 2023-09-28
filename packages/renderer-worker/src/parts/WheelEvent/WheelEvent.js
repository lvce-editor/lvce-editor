import * as IsFirefox from '../IsFirefox/IsFirefox.js'

export const normalizeDelta = (delta) => {
  if (IsFirefox.isFirefox) {
    return delta * (52 / 114)
  }
  return delta
}
