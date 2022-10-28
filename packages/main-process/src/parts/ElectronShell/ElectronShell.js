const { shell } = require('electron')

exports.showItemInFolder = (fullPath) => {
  shell.showItemInFolder(fullPath)
}

exports.openExternal = async (url) => {
  await shell.openExternal(url)
}

exports.beep = () => {
  shell.beep()
}
