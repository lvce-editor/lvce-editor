const { Menu, BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.js')

exports.openContextMenu = (template, x, y) => {
  Assert.array(template)
  Assert.number(x)
  Assert.number(y)
  const menu = Menu.buildFromTemplate(template)
  console.log({ menu })
  const window = BrowserWindow.getFocusedWindow()
  if (!window) {
    return
  }
  menu.popup({ window, x, y })
}
