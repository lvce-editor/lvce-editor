const { shell } = require('electron')
const Assert = require('../Assert/Assert.js')

exports.trash = async (path) => {
  Assert.string(path)
  await shell.trashItem(path)
}
