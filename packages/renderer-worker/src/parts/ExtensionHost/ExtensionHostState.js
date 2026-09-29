import * as ExtensionStateStorage from '../ExtensionStateStorage/ExtensionStateStorage.js'
import * as IframeWorker from '../IframeWorker/IframeWorker.js'

export const saveState = async () => {
  if (!IframeWorker.isCreated()) {
    return (await getSavedState()) || []
  }
  return IframeWorker.invoke('WebView.saveState')
}

export const getSavedState = async () => {
  const value = await ExtensionStateStorage.getJson()
  return value
}
