import { BrowserWindow } from 'electron'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.cjs'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

export const createPidMap = () => {
  const browserWindows = BrowserWindow.getAllWindows()
  const browserViews = ElectronBrowserViewState.getAll()
  const utilityProcesses = UtilityProcessState.getAll()
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
