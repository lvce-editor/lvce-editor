const { ipcMain } = require('electron')
const { writeFile } = require('node:fs/promises')
const { BrowserWindow, Menu } = require('electron')
const VError = require('verror')
const ListProcessesWithMemoryUsage = require('../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.js')
const Platform = require('../Platform/Platform.js')
const Session = require('../ElectronSession/ElectronSession.js')
const ColorTheme = require('../ColorTheme/ColorTheme.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

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

    const updateStats = async () => {
      const processesWithMemoryUsage = await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(process.pid)
      browserWindowPort.postMessage({
        jsonrpc: JsonRpcVersion.Two,
        method: 'processWithMemoryUsage',
        params: [processesWithMemoryUsage],
      })
    }

    const showContextMenu = (processId) => {
      const template = [
        {
          label: 'Kill Process',
          click: () => {
            const Process = require('../Process/Process.js')
            Process.kill(processId, 'SIGTERM')
          },
        },
      ]
      const menu = Menu.buildFromTemplate(template)
      menu.popup({
        window: processExplorerWindow,
      })
    }

    // TODO possible memory leak? browserWindowPort should be destroyed when Window is closed
    browserWindowPort.on('message', async (event) => {
      const message = event.data
      switch (message.method) {
        case 'updateStats':
          return updateStats()
        case 'showContextMenu':
          return showContextMenu(...message.params)
        default:
          break
      }
    })

    browserWindowPort.start()
  }

  ipcMain.on('port', handlePort)

  const handleClose = () => {
    ipcMain.off('port', handlePort)
  }

  processExplorerWindow.once('close', handleClose)

  // TODO get actual process explorer theme css from somewhere
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  await writeFile('/tmp/process-explorer-theme.css', processExplorerThemeCss)
  try {
    await processExplorerWindow.loadURL(`${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`)
  } catch (error) {
    throw new VError(
      // @ts-ignore
      error,
      `Failed to load process explorer url `
    )
  }
}
