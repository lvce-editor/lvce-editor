const { BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const UtilityProcessState = require('../UtilityProcessState/UtilityProcessState.js')

/**
 *
 * @param {import('electron').BrowserWindow[]} browserWindows
 */
const createPidWindowMap = (browserWindows) => {
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
  for (const { view } of ElectronBrowserViewState.getAll()) {
    const viewWebContents = view.webContents
    const pid = viewWebContents.getOSProcessId()
    if (pid in pidWindowMap) {
      continue
    }
    pidWindowMap[pid] = `hidden-browser-view-${viewWebContents.id}`
  }
  for (const [pid, name] of UtilityProcessState.getAll()) {
    pidWindowMap[pid] = name
  }
  return pidWindowMap
}

exports.getName = (pid, cmd, rootPid) => {
  Assert.object(process)
  Assert.number(rootPid)
  const browserWindows = BrowserWindow.getAllWindows()
  const pidWindowMap = createPidWindowMap(browserWindows)
  if (pid === rootPid) {
    return 'main'
  }
  if (cmd.includes('--type=zygote')) {
    return 'zygote'
  }
  if (cmd.includes('--type=gpu-process')) {
    return 'gpu-process'
  }
  if (cmd.includes('--type=utility')) {
    return 'utility'
  }
  if (cmd.includes('extensionHostMain.js')) {
    return 'extension-host'
  }
  if (cmd.includes('ptyHostMain.js')) {
    return 'pty-host'
  }
  if (cmd.includes('--lvce-window-kind=process-explorer')) {
    return 'process-explorer'
  }
  if (cmd.includes('--type=renderer')) {
    return pidWindowMap[pid] || `<unknown renderer>`
  }
  if (cmd.includes('typescript/lib/tsserver.js')) {
    return 'tsserver.js'
  }
  if (cmd.includes('extensionHostHelperProcessMain.js')) {
    return 'extension-host-helper-process'
  }
  return `<unknown> ${cmd}`
}
