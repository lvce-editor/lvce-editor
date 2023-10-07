const { shell } = require('electron')
const { VError } = require('../VError/VError.cjs')
const ShouldOpenExternal = require('../ShouldOpenExternal/ShouldOpenExternal.cjs')

exports.openExternal = async (url) => {
  if (!ShouldOpenExternal.shouldOpenExternal(url)) {
    throw new VError(`only http or https urls are allowed`)
  }
  await shell.openExternal(url)
}
