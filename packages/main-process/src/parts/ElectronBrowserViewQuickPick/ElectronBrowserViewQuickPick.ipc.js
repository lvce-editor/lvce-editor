const ElectronBrowserViewQuickPick = require('./ElectronBrowserViewQuickPick.js')

exports.name = 'ElectronBrowserViewQuickPick'

// prettier-ignore
exports.Commands = {
  createBrowserViewQuickPick: ElectronBrowserViewQuickPick.createBrowserViewQuickPick,
  disposeBrowserViewQuickPick: ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick,
}
