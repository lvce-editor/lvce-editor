const { shell } = require('electron')

exports.showItemInFolder = (fullPath) => {
  shell.showItemInFolder(fullPath)
}

exports.beep = () => {
  shell.beep()
}
