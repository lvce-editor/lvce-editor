/**
 *
 * @param {import('electron').BrowserWindow[]} browserWindows
 */
exports.createPidMap = (browserWindows, browserViews, utilityProcesses) => {
  const pidWindowMap = Object.create(null)
  for (const browserWindow of browserWindows) {
    const { webContents } = browserWindow
    const pid = webContents.getOSProcessId()
    pidWindowMap[pid] = 'renderer'
    const { devToolsWebContents } = webContents
    if (devToolsWebContents) {
      const pid = devToolsWebContents.getOSProcessId()
      pidWindowMap[pid] = 'chrome-devtools'
    }
    const views = browserWindow.getBrowserViews()
    for (const view of views) {
      const viewWebContents = view.webContents
      const pid = viewWebContents.getOSProcessId()
      const displayName = `browser-view-${viewWebContents.id}`
      pidWindowMap[pid] = displayName
    }
  }
  for (const { view } of browserViews) {
    const viewWebContents = view.webContents
    const pid = viewWebContents.getOSProcessId()
    if (pid in pidWindowMap) {
      continue
    }
    pidWindowMap[pid] = `hidden-browser-view-${viewWebContents.id}`
  }
  for (const [pid, name] of utilityProcesses) {
    pidWindowMap[pid] = name
  }
  return pidWindowMap
}
