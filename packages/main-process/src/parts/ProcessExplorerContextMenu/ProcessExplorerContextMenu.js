const { BrowserWindow, Menu } = require('electron')
const Signal = require('../Signal/Signal.js')

exports.showContextMenu = (processId) => {
  const template = [
    {
      label: 'Kill Process',
      click: () => {
        const Process = require('../Process/Process.js')
        Process.kill(processId, Signal.SIGTERM)
      },
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({
    window: BrowserWindow.getFocusedWindow() || undefined,
  })
}
