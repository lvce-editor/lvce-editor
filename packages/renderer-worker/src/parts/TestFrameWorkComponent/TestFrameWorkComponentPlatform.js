import * as IsFirefox from '../IsFirefox/IsFirefox.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getNodePath = () => {
  return PlatformPaths.getNodePath()
}

export const isFirefox = () => {
  return IsFirefox.isFirefox
}
