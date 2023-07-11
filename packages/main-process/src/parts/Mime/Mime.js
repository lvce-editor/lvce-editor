import { extname } from 'path'
import * as MimeTypes from '../MimeTypes/MimeTypes.js'

export const getMime = (uri) => {
  const extension = extname(uri)
  return MimeTypes.mapExtToTextMimes[extension] || MimeTypes.defaultMimeType
}
