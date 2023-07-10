const { shell } = require('electron')
const Assert = require('../Assert/Assert.cjs')

exports.trash = async (path) => {
  Assert.string(path)
  await shell.trashItem(path)
}
