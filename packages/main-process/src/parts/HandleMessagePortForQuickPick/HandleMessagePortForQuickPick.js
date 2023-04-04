const Electron = require('electron')
const PendingPorts = require('../PendingPorts/PendingPorts.js')

/**
 *
 * @param {*} views
 * @returns {Electron.BrowserView|undefined}
 */
const getQuickPickViewFromArray = (views) => {
  for (const view of views) {
    const url = view.webContents.getURL()
    console.log({ url })
    if (url.endsWith('quickpick.html')) {
      return view
    }
  }
  return undefined
}

exports.handlePort = (event, browserWindowPort) => {
  const browserWindow = Electron.BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const quickPickview = getQuickPickViewFromArray(views)
  if (!quickPickview) {
    PendingPorts.add('quickPick', browserWindowPort)
    // TODO handle different quickpick view states
    // disposed -> do nothing
    // creating -> wait for creation, then post message
    console.log('no quickpick view', views)
    return
  }
  console.log('send port to quickpick')
  quickPickview.webContents.postMessage('port', '', [browserWindowPort])
}
