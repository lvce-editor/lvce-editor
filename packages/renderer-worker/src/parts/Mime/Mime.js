// TODO add support for other image types: png, jpg, jpeg, avif, webp, etc.
export const getMimeType = (uri) => {
  if (uri.endsWith('.svg')) {
    return 'image/svg+xml'
  }
  return ''
}
