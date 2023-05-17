const ProcessExplorerContextMenu = require('./ProcessExplorerContextMenu.js')

exports.name = 'ProcessExplorerContextMenu'

exports.Commands = {
  showContextMenu: ProcessExplorerContextMenu.showContextMenu,
}
