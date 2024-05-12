import * as ElectronShell from '../ElectronShell/ElectronShell.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as ElectronWindowOpenActionType from '../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js'
import * as Logger from '../Logger/Logger.js'
import * as ShouldAllowNavigation from '../ShouldAllowNavigation/ShouldAllowNavigation.js'

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
