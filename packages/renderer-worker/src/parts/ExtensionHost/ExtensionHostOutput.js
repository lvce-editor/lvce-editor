import * as Platform from '../Platform/Platform.js'
// @ts-ignore
import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getOutputChannels = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return []
  }
  return []
  // return ExtensionHost.invoke(
  // /* ExtensionHostOutput.getOutputChannels */ 'ExtensionHostOutput.getOutputChannels'
  // )
}
