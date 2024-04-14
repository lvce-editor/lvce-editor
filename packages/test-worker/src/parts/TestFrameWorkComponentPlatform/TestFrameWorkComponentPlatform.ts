import * as IsFirefox from '../IsFirefox/IsFirefox.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

export const getNodePath = (): Promise<string> => {
  return PlatformPaths.getNodePath()
}

export const isFirefox = (): boolean => {
  return IsFirefox.isFirefox
}
