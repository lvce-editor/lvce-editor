import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getExtensions = async () => {
  if (Platform.getPlatform() === 'web') {
    return []
  }
  const extensions = await SharedProcess.invoke(
    /* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions'
  )
  return extensions
}
