const { net } = require('electron')
const { pathToFileURL } = require('node:url')

exports.getFileResponse = (path) => {
  const url = pathToFileURL(path)
  const response = net.fetch(url)
  return response
}
