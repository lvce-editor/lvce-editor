const ElectronBrowserViewSuggestions = require('./ElectronBrowserViewSuggestions.js')

exports.name = 'ElectronBrowserViewSuggestions'

// prettier-ignore
exports.Commands = {
  createBrowserView: ElectronBrowserViewSuggestions.createBrowserView,
  disposeBrowserView: ElectronBrowserViewSuggestions.disposeBrowserView,
  setSuggestions: ElectronBrowserViewSuggestions.setSuggestions,
}
