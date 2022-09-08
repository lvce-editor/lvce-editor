import * as Platform from '../Platform/Platform.js'
import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getOutputChannels = () => {
  if (Platform.platform === PlatformType.Web) {
    return []
  }
  return ExtensionHost.invoke(
    /* ExtensionHostOutput.getOutputChannels */ 'ExtensionHostOutput.getOutputChannels'
  )
}
