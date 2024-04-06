import * as IsFirefox from '../IsFirefox/IsFirefox.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

export const getNodePath = () => {
  return PlatformPaths.getNodePath()
}

export const isFirefox = () => {
  return IsFirefox.isFirefox
}
