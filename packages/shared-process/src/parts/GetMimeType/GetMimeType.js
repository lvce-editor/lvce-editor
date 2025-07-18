import * as MimeType from '../MimeType/MimeType.js'

export const getMimeType = (fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return MimeType.TextHtml
    case '.css':
      return MimeType.TextCss
    case '.ttf':
      return MimeType.FontTtf
    case '.js':
    case '.mjs':
    case '.ts':
      return MimeType.TextJavaScript
    case '.svg':
      return MimeType.ImageSvgXml
    case '.png':
      return MimeType.ImagePng
    case '.json':
    case '.map':
      return MimeType.ApplicationJson
    case '.mp3':
      return MimeType.AudioMpeg
    case '.webm':
      return MimeType.VideoWebm
    case '.md':
      return MimeType.Markdown
    default:
      console.warn(`[shared-process] unsupported file extension: ${fileExtension}`)
      return ''
  }
}
