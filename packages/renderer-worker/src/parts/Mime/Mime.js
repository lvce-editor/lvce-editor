import * as MimeTypes from '../MimeTypes/MimeTypes.js'
import * as Path from '../Path/Path.js'

export const getTextMime = (uri) => {
  const extension = Path.fileExtension(uri)
  return MimeTypes.mapExtToTextMimes[extension] || MimeTypes.defaultMimeType
}

export const getMediaMimeType = (uri) => {
  const extension = Path.fileExtension(uri)
  return MimeTypes.mapExtToMediaMimes[extension] || MimeTypes.defaultMimeType
}
