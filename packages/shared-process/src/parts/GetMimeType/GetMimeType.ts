import * as MimeType from '../MimeType/MimeType.ts'

export const getMimeType = (fileExtension: any): any => {
  switch (fileExtension) {
    case '.css':
      return MimeType.TextCss
    case '.html':
      return MimeType.TextHtml
    case '.js':
    case '.mjs':
    case '.ts':
      return MimeType.TextJavaScript
    case '.json':
    case '.map':
      return MimeType.ApplicationJson
    case '.md':
      return MimeType.Markdown
    case '.mp3':
      return MimeType.AudioMpeg
    case '.png':
      return MimeType.ImagePng
    case '.svg':
      return MimeType.ImageSvgXml
    case '.ttf':
      return MimeType.FontTtf
    case '.webm':
      return MimeType.VideoWebm
    default:
      console.warn(`[shared-process] unsupported file extension: ${fileExtension}`)
      return ''
  }
}
