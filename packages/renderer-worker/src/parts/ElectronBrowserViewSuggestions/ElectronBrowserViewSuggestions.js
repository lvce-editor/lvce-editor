import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const createBrowserView = (x, y, width, height) => {
  return ElectronProcess.invoke('ElectronBrowserViewSuggestions.createBrowserView', x, y, width, height)
}

export const disposeBrowserView = () => {
  return ElectronProcess.invoke('ElectronBrowserViewSuggestions.disposeBrowserView')
}

export const setSuggestions = (suggestions) => {
  return ElectronProcess.invoke('ElectronBrowserViewSuggestions.setSuggestions', suggestions)
}
