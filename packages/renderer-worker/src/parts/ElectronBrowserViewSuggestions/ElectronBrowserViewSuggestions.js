import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createBrowserView = (x, y, width, height) => {
  return SharedProcess.invoke('ElectronBrowserViewSuggestions.createBrowserView', x, y, width, height)
}

export const disposeBrowserView = () => {
  return SharedProcess.invoke('ElectronBrowserViewSuggestions.disposeBrowserView')
}

export const setSuggestions = (suggestions) => {
  return SharedProcess.invoke('ElectronBrowserViewSuggestions.setSuggestions', suggestions)
}
