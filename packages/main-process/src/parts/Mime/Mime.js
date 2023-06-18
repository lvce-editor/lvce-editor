const { extname } = require('path')
const MimeTypes = require('../MimeTypes/MimeTypes.js')

exports.getMime = (uri) => {
  const extension = extname(uri)
  return MimeTypes.mapExtToTextMimes[extension] || MimeTypes.defaultMimeType
}
