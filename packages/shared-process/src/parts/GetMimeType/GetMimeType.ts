import * as MimeType from '../MimeType/MimeType.ts'

export const getMimeType = (fileExtension: string): string => {
  switch (fileExtension.toLowerCase()) {
    case '.apng':
      return MimeType.ImageApng
    case '.avif':
      return MimeType.ImageAvif
    case '.bmp':
      return MimeType.ImageBmp
    case '.css':
      return MimeType.TextCss
    case '.gif':
      return MimeType.ImageGif
    case '.heic':
      return MimeType.ImageHeic
    case '.heif':
      return MimeType.ImageHeif
    case '.html':
      return MimeType.TextHtml
    case '.ico':
      return MimeType.ImageXIcon
    case '.jfif':
    case '.jpe':
    case '.jpeg':
    case '.jpg':
      return MimeType.ImageJpg
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
    case '.tif':
    case '.tiff':
      return MimeType.ImageTiff
    case '.ttf':
      return MimeType.FontTtf
    case '.webm':
      return MimeType.VideoWebm
    case '.webp':
      return MimeType.ImageWebp
    default:
      console.warn(`[shared-process] unsupported file extension: ${fileExtension}`)
      return ''
  }
}
