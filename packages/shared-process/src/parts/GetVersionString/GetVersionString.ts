import * as Platform from '../Platform/Platform.ts'

export const getVersionString = () => {
  const { version } = Platform
  return version
}
