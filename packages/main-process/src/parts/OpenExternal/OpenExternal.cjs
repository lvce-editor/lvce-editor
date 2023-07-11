const { shell } = require('electron')
const { VError } = require('../VError/VError.cjs')

exports.openExternal = async (url) => {
  if (!url.startsWith('http:') && !url.startsWith('https:')) {
    throw new VError(`only http or https urls are allowed`)
  }
  await shell.openExternal(url)
}
