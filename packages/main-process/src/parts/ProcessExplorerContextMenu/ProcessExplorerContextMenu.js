const { BrowserWindow, Menu } = require('electron')

exports.showContextMenu = (processId) => {
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
    window: BrowserWindow.getFocusedWindow() || undefined,
  })
}
