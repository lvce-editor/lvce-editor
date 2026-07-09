import * as Platform from '../Platform/Platform.ts'

export const getVersionString = (): any => {
  const { version } = Platform
  return version
}
