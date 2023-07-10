const ElectronAplicationMenu = require('./ElectronApplicationMenu.cjs')

exports.name = 'ElectronApplicationMenu'

// prettier-ignore
exports.Commands = {
  setItems: ElectronAplicationMenu.setItems,
}
