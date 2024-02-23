import * as Debug from '../Debug/Debug.js'
import * as ElectronShell from '../ElectronShell/ElectronShell.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as ElectronWindowOpenActionType from '../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Logger from '../Logger/Logger.js'
import * as ShouldAllowNavigation from '../ShouldAllowNavigation/ShouldAllowNavigation.js'

// TODO move this function to shared process
export const handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

const handleWebContentsWindowOpen = ({ url }) => {
  ElectronShell.openExternal(url)
  return {
    action: ElectronWindowOpenActionType.Deny,
  }
}

/**
 *
 * @param {*} event
 * @param {Electron.WebContents} webContents
 */
export const handleWebContentsCreated = (event, webContents) => {
  /**
   *
   * @param {import('electron').Event<import('electron').WebContentsWillNavigateEventParams>} event
   * @returns
   */
  const handleWebContentsNavigate = (event) => {
    if (ShouldAllowNavigation.shouldAllowNavigation(webContents.id)) {
      return
    }
    Logger.error('[main-process] Prevented webcontent navigation')
    event.preventDefault()
  }
  webContents.on(ElectronWebContentsEventType.WillNavigate, handleWebContentsNavigate)
  // @ts-ignore
  webContents.setWindowOpenHandler(handleWebContentsWindowOpen)
}
