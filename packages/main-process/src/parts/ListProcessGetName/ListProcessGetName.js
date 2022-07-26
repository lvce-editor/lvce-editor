const Assert = require('../Assert/Assert.js')
const { BrowserWindow } = require('electron')

/**
 *
 * @param {import('electron').BrowserWindow[]} browserWindows
 */
const createPidWindowMap = (browserWindows) => {
  const pidWindowMap = Object.create(null)
  for (const browserWindow of browserWindows) {
    pidWindowMap[browserWindow.webContents.getOSProcessId()] = 'renderer'
    if (browserWindow.webContents.devToolsWebContents) {
      pidWindowMap[
        browserWindow.webContents.devToolsWebContents.getOSProcessId()
      ] = 'chrome-devtools'
    }
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
  if (cmd.includes('--type=renderer')) {
    return pidWindowMap[pid] || `<unknown renderer>`
  }
  if (cmd.includes('typescript/lib/tsserver.js')) {
    return 'tsserver.js'
  }
  return `<unknown> ${cmd}`
}
