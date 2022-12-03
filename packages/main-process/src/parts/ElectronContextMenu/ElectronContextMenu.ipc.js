const ElectronContextMenu = require('./ElectronContextMenu.js')

exports.name = 'ElectronContextMenu'

exports.Commands = {
  openContextMenu: ElectronContextMenu.openContextMenu,
}
