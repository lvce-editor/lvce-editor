const ElectronBrowserView = require('./ElectronBrowserView.js')

// prettier-ignore
exports.Commands = {

  'ElectronBrowserView.createBrowserView': ElectronBrowserView.createBrowserView,
  'ElectronBrowserView.createBrowserViewQuickPick': ElectronBrowserView.createBrowserViewQuickPick,
  'ElectronBrowserView.disposeBrowserView': ElectronBrowserView.disposeBrowserView,
  'ElectronBrowserView.resizeBrowserView': ElectronBrowserView.resizeBrowserView,
  'ElectronBrowserView.setQuickPickItems': ElectronBrowserView.setQuickPickItems,
  'ElectronBrowserView.setQuickPickValue': ElectronBrowserView.setQuickPickValue,
}
