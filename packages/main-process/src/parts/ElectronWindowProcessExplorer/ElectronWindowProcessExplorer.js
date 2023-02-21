const { ipcMain } = require('electron')
const { writeFile } = require('node:fs/promises')
const { BrowserWindow, Menu } = require('electron')
const VError = require('verror')
const Platform = require('../Platform/Platform.js')
const Session = require('../ElectronSession/ElectronSession.js')
const ColorTheme = require('../ColorTheme/ColorTheme.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const GetResponse = require('../GetResponse/GetResponse.js')
const { join } = require('node:path')
const { tmpdir } = require('node:os')

/**
 *
 * @param {Electron.Event} event
 * @param {Electron.Input} input
 */
const handleBeforeInput = (event, input) => {
  if (input.control && input.key.toLowerCase() === 'i') {
    event.preventDefault()
    // console.log(event.sender)
    // console.log(event.sender)
    event.sender.openDevTools()
    // event.sender.webContents.openDevTools()
  }
}

exports.open = async () => {
  const colorThemeJson = await ColorTheme.getColorThemeJson()
  const backgroundColor = colorThemeJson.MainBackground
  const processExplorerWindow = new BrowserWindow({
    width: 800,
    height: 500,
    backgroundColor,
    webPreferences: {
      session: Session.get(),
      preload: Path.join(Root.root, 'packages', 'main-process', 'pages', 'process-explorer', 'process-explorer-preload.js'),
      sandbox: true,
      additionalArguments: ['--lvce-window-kind=process-explorer'],
    },
  })
  processExplorerWindow.setMenuBarVisibility(false)

  /**
   * @param {import('electron').IpcMainEvent} event
   */
  const handlePort = async (event) => {
    if (event.sender !== processExplorerWindow.webContents) {
      return
    }
    const browserWindowPort = event.ports[0]
    // TODO possible memory leak? browserWindowPort should be destroyed when Window is closed
    browserWindowPort.on('message', async (event) => {
      const message = event.data
      const response = await GetResponse.getResponse(message)
      browserWindowPort.postMessage(response)
    })

    browserWindowPort.start()
  }

  ipcMain.on('port', handlePort)

  const handleClose = () => {
    ipcMain.off('port', handlePort)
  }

  processExplorerWindow.once('close', handleClose)

  processExplorerWindow.webContents.on('before-input-event', handleBeforeInput)
  // TODO get actual process explorer theme css from somewhere
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  const processExporerThemeCssPath = join(tmpdir(), 'process-explorer-theme.css')
  await writeFile(processExporerThemeCssPath, processExplorerThemeCss)
  try {
    await processExplorerWindow.loadURL(`${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to load process explorer url `)
  }
}
