import * as ElectronBrowserViewSuggestions from './ElectronBrowserViewSuggestions.js'

export const name = 'ElectronBrowserViewSuggestions'

export const Commands = {
  createBrowserView: ElectronBrowserViewSuggestions.createBrowserView,
  disposeBrowserView: ElectronBrowserViewSuggestions.disposeBrowserView,
  setSuggestions: ElectronBrowserViewSuggestions.setSuggestions,
}
