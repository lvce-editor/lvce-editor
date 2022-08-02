const { ipcMain } = require('electron')
const { writeFile } = require('fs/promises')
const { join } = require('path')
const VError = require('verror')
const { BrowserWindow, Menu } = require('../Electron/Electron.js')
const ListProcessesWithMemoryUsage = require('../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.js')
const Platform = require('../Platform/Platform.js')
const Session = require('../Session/Session.js')
const ColorTheme = require('../ColorTheme/ColorTheme.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

const JSON_RPC_VERSION = '2.0'

exports.openProcessExplorer = async () => {
  const processExplorerWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      session: Session.get(),
      preload: Path.join(
        Root.root,
        'packages',
        'main-process',
        'pages',
        'process-explorer',
        'process-explorer-preload.js'
      ),
      sandbox: true,
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
      const processesWithMemoryUsage =
        await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(
          process.pid
        )
      browserWindowPort.postMessage({
        jsonrpc: JSON_RPC_VERSION,
        method: 'processWithMemoryUsage',
        params: [processesWithMemoryUsage],
      })
    }

    const showContextMenu = (processId) => {
      console.log({ processId })
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
      console.log('show context menu')
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
  const colorThemeJson = await ColorTheme.getColorThemeJson()
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  await writeFile('/tmp/process-explorer-theme.css', processExplorerThemeCss)
  try {
    await processExplorerWindow.loadURL(
      `${Platform.getScheme()}://-/packages/main-process/pages/process-explorer/process-explorer.html`
    )
  } catch (error) {
    throw new VError(
      // @ts-ignore
      error,
      `Failed to load process explorer url `
    )
  }
}
