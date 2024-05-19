import { BrowserWindow } from 'electron'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

export const createPidMap = () => {
  const browserWindows = BrowserWindow.getAllWindows()
  const browserViews = []
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
    const views = browserWindow.getBrowserViews() // TODO use webcontents views
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
  for (const [pid, value] of utilityProcesses) {
    pidWindowMap[pid] = value.name
  }
  return pidWindowMap
}
