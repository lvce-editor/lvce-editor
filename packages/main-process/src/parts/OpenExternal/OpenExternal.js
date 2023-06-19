const { shell } = require('electron')
const { VError } = require('../VError/VError.js')

exports.openExternal = async (url) => {
  if (!url.startsWith('http:') && !url.startsWith('https:')) {
    throw new VError(`only http or https urls are allowed`)
  }
  await shell.openExternal(url)
}
