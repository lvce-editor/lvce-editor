import * as Listener from '../Listener/Listener.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const state = {
  changeListeners: [],
}

const getStatusBarItemsFromExtension = (extension) => {
  if (!extension.statusBarItems) {
    return []
  }
  return extension.statusBarItems
}

const getStatusBarItemsFromExtensions = (extensions) => {
  return extensions.flatMap(getStatusBarItemsFromExtension)
}

const combineResults = (results) => {
  return []
}

export const getStatusBarItems = async () => {
  return ExtensionHostShared.executeProviders({
    event: 'onStatusBarItem',
    method: 'ExtensionHost.getStatusBarItems',
    params: [],
    noProviderFoundMessage: 'No status bar item provider found',
    combineResults,
  })
}

// TODO add function to dispose listener
export const onChange = async (listener) => {
  const id = Listener.register(listener)
  return ExtensionHostShared.execute({
    method: 'ExtensionHostStatusBar.registerChangeListener',
    params: [id],
  })
}
