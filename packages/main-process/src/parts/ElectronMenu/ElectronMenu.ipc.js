const ElectronMenu = require('./ElectronMenu.js')

exports.name = 'ElectronMenu'

exports.Commands = {
  openContextMenu: ElectronMenu.openContextMenu,
}
