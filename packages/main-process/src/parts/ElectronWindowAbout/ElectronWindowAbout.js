const Electron = require('electron')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')

// const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Show an about window, similar to https://github.com/rhysd/electron-about-window
 */
exports.open = async () => {
  const focusedWindow = Electron.BrowserWindow.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  const aboutWindow = new Electron.BrowserWindow({
    width: 400,
    height: 400,
    minWidth: 350,
    minHeight: 350,
    titleBarStyle: 'hiddenInset',
    parent: focusedWindow,
    title: 'About Code Editor',
    center: true,
    // autoHideMenuBar: true,
    webPreferences: {
      session: Session.get(),
      contextIsolation: false,
      sandbox: false,
      nodeIntegration: true,
    },
    show: false,
  })
  aboutWindow.setMenuBarVisibility(false)
  // aboutWindow.removeMenu()
  const handleReadyToShow = () => {
    aboutWindow.show()
  }
  aboutWindow.once('ready-to-show', handleReadyToShow)
  try {
    await aboutWindow.loadURL(
      `${Platform.scheme}://-/packages/main-process/pages/about/about.html`
    )
  } catch (error) {
    console.warn('Failed to load about window')
    console.warn(error)
  }
}
