import * as Platform from '../Platform/Platform.js'

export const getSharedProcessArgv = () => {
  if (Platform.isProduction) {
    return ['--enable-source-maps']
  }
  return []
}
