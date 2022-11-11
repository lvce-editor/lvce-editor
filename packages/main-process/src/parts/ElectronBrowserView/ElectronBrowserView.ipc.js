const ElectronBrowserView = require('./ElectronBrowserView.js')

exports.name = 'ElectronBrowserView'

// prettier-ignore
exports.Commands = {
  createBrowserView: ElectronBrowserView.createBrowserView,
  disposeBrowserView: ElectronBrowserView.disposeBrowserView,
}
