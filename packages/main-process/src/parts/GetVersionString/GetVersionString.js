import * as Platform from '../Platform/Platform.cjs'

export const getVersionString = () => {
  const version = Platform.version
  return version
}
