const prefix = 'html-preview:///'

export const isHtmlPreviewUrl = (url) => typeof url === 'string' && url.startsWith(prefix)

const fileUrlPrefix = 'file:///'

const encodeFileUrl = (uri) => {
  const path = uri.slice(fileUrlPrefix.length)
  const encodedPath = encodeURIComponent(path).replaceAll('%2F', '/').replaceAll('%3A', ':')
  return `${prefix}file/${encodedPath}`
}

export const encode = (uri) => (uri.startsWith(fileUrlPrefix) ? encodeFileUrl(uri) : prefix + encodeURIComponent(uri))

export const decode = (url) => {
  if (!isHtmlPreviewUrl(url)) throw new Error('Invalid HTML preview URL')
  const value = url.slice(prefix.length)
  if (value.startsWith('file/')) {
    return fileUrlPrefix + decodeURIComponent(value.slice('file/'.length))
  }
  return decodeURIComponent(value)
}
