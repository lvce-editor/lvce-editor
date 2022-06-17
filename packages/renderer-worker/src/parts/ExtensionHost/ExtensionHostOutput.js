import * as Platform from '../Platform/Platform.js'
import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'

export const getOutputChannels = () => {
  if (Platform.getPlatform() === 'web') {
    return []
  }
  return ExtensionHost.invoke(
    /* ExtensionHostOutput.getOutputChannels */ 'ExtensionHostOutput.getOutputChannels'
  )
}
