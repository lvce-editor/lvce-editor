export const getMimeType = (fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.ttf':
      return 'font/ttf'
    case '.js':
      return 'text/javascript'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.json':
      return 'application/json'
    default:
      console.warn(`unsupported file extension: ${fileExtension}`)
      return ''
  }
}
