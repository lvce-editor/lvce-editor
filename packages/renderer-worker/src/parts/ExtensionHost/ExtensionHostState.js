import * as ExtensionStateStorage from '../ExtensionStateStorage/ExtensionStateStorage.js'
import * as IframeWorker from '../IframeWorker/IframeWorker.js'

export const saveState = async () => {
  return IframeWorker.invoke('WebView.saveState')
}

export const getSavedState = async () => {
  const value = await ExtensionStateStorage.getJson()
  return value
}
