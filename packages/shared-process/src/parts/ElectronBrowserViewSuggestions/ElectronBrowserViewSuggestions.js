import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createBrowserView = (x, y, width, height) => {
  return ParentIpc.invoke('ElectronBrowserViewSuggestions.createBrowserView', x, y, width, height)
}

export const disposeBrowserView = () => {
  return ParentIpc.invoke('ElectronBrowserViewSuggestions.disposeBrowserView')
}

export const setSuggestions = (suggestions) => {
  return ParentIpc.invoke('ElectronBrowserViewSuggestions.setSuggestions', suggestions)
}
