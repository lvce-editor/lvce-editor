const ElectronBrowserView = require('./ElectronBrowserView.js')

// prettier-ignore
exports.Commands = {
  'ElectronBrowserView.createBrowserView': ElectronBrowserView.createBrowserView,
  'ElectronBrowserView.disposeBrowserView': ElectronBrowserView.disposeBrowserView,
}
