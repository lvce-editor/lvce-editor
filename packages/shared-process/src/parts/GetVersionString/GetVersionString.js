import * as Platform from '../Platform/Platform.js'

export const getVersionString = () => {
  const { version } = Platform
  return version
}
