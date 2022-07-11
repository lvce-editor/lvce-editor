import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const state = {
  /**
   * @type {any[]}
   */
  extensions: [],
}

export const addExtension = (extension) => {
  state.extensions.push(extension)
}

export const getExtensions = async () => {
  if (Platform.getPlatform() === 'web') {
    return state.extensions
  }
  const extensions = await SharedProcess.invoke(
    /* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions'
  )
  return extensions
}
