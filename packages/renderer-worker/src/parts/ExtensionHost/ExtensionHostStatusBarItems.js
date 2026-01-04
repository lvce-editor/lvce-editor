import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as Listener from '../Listener/Listener.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const state = {
  changeListeners: [],
}

const combineResults = (results) => {
  return results.flat(1)
}

export const getStatusBarItems = (assetDir, platform) => {
  return ExtensionHostShared.executeProviders({
    event: ExtensionHostActivationEvent.OnStatusBarItem,
    method: ExtensionHostCommandType.GetStatusBarItems,
    params: [],
    noProviderFoundMessage: 'No status bar item provider found',
    noProviderFoundResult: [],
    combineResults,
    assetDir,
    platform,
  })
}

// TODO add function to dispose listener
export const onChange = (listener) => {
  const id = Listener.register(listener)
  return ExtensionHostShared.execute({
    method: ExtensionHostCommandType.RegisterStatusBarChangeListener,
    params: [id],
  })
}
