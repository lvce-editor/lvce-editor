import * as IsFirefox from '../IsFirefox/IsFirefox.js'
import * as Platform from '../Platform/Platform.js'

export const getNodePath = () => {
  return Platform.getNodePath()
}

export const isFirefox = () => {
  return IsFirefox.isFirefox
}
