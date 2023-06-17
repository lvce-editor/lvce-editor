const { BrowserWindow } = require('electron')
const { join } = require('node:path')
const { tmpdir } = require('node:os')
const { writeFile } = require('node:fs/promises')
const ColorTheme = require('../ColorTheme/ColorTheme.js')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.js')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Session = require('../ElectronSession/ElectronSession.js')

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
  const id = processExplorerWindow.webContents.id
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectort: '',
    id,
  })
  const handleWindowClose = () => {
    processExplorerWindow.off('close', handleWindowClose)
    AppWindowStates.remove(id)
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
  try {
    await processExplorerWindow.loadURL(`${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`)
  } catch (error) {
    console.error(error)
    // @ts-ignore
    // throw new VError(error, `Failed to load process explorer url `)
  }
}
