const { shell } = require('electron')

exports.showItemInFolder = (fullPath) => {
  shell.showItemInFolder(fullPath)
}

exports.openExternal = async (url) => {
  await shell.openExternal(url)
}

exports.openPath = async (path) => {
  // TODO handle error
  await shell.openPath(path)
}

exports.beep = () => {
  shell.beep()
}
