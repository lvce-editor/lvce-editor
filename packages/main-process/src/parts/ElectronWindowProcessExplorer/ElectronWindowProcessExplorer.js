import { BrowserWindow } from 'electron'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as AppWindowStates from '../AppWindowStates/AppWindowStates.cjs'
import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as Session from '../ElectronSession/ElectronSession.cjs'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.cjs'
import * as GetProcessExplorerUrl from '../GetProcessExplorerUrl/GetProcessExplorerUrl.js'

export const open = async () => {
  const colorThemeJson = await ColorTheme.getColorThemeJson()
  const backgroundColor = colorThemeJson.MainBackground
  const preload = GetProcessExplorerUrl.getProcessExplorerPreloadUrl()
  const processExplorerWindow = new BrowserWindow({
    width: 800,
    height: 500,
    backgroundColor,
    webPreferences: {
      session: Session.get(),
      preload,
      sandbox: true,
      additionalArguments: ['--lvce-window-kind=process-explorer'],
    },
  })
  const windowId = processExplorerWindow.id
  const webContentsId = processExplorerWindow.webContents.id
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectort: '',
    webContentsId,
    windowId,
  })
  const handleWindowClose = () => {
    processExplorerWindow.off('close', handleWindowClose)
    AppWindowStates.remove(windowId)
  }
  /**
   *
   * @param {Electron.Event} event
   * @param {Electron.Input} input
   */
  const handleBeforeInput = (event, input) => {
    if (input.control && input.key.toLowerCase() === 'i') {
      event.preventDefault()
      processExplorerWindow.webContents.openDevTools()
    }
    if (input.code && input.key.toLowerCase() === 'r') {
      event.preventDefault()
      processExplorerWindow.reload()
    }
  }

  processExplorerWindow.on('close', handleWindowClose)
  processExplorerWindow.setMenuBarVisibility(false)
  processExplorerWindow.webContents.on(ElectronWebContentsEventType.BeforeInputEvent, handleBeforeInput)

  // TODO get actual process explorer theme css from somewhere
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  const processExporerThemeCssPath = join(tmpdir(), 'process-explorer-theme.css')
  await writeFile(processExporerThemeCssPath, processExplorerThemeCss)
  const url = GetProcessExplorerUrl.getProcessExplorerUrl()
  try {
    await processExplorerWindow.loadURL(url)
  } catch (error) {
    console.error(error)
    // @ts-ignore
    // throw new VError(error, `Failed to load process explorer url `)
  }
}
