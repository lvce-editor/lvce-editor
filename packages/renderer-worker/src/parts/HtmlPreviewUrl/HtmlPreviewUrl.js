const prefix = 'html-preview:///'

export const isHtmlPreviewUrl = (url) => typeof url === 'string' && url.startsWith(prefix)

const fileUrlPrefix = 'file:///'

const encodeFileUrl = (uri) => {
  const path = uri.slice(fileUrlPrefix.length)
  const encodedPath = encodeURIComponent(path).replaceAll('%2F', '/').replaceAll('%3A', ':')
  return `${prefix}file/${encodedPath}`
}

const memfsUrlPrefix = 'memfs://'

const encodeMemfsUrl = (uri) => {
  const path = uri.slice(memfsUrlPrefix.length)
  const encodedPath = encodeURIComponent(path).replaceAll('%2F', '/')
  return `${prefix}memfs/${encodedPath}`
}

export const encode = (uri) => {
  if (uri.startsWith(fileUrlPrefix)) return encodeFileUrl(uri)
  if (uri.startsWith(memfsUrlPrefix)) return encodeMemfsUrl(uri)
  return prefix + encodeURIComponent(uri)
}

export const decode = (url) => {
  if (!isHtmlPreviewUrl(url)) throw new Error('Invalid HTML preview URL')
  const value = url.slice(prefix.length)
  if (value.startsWith('file/')) {
    return fileUrlPrefix + decodeURIComponent(value.slice('file/'.length))
  }
  if (value.startsWith('memfs/')) {
    return memfsUrlPrefix + decodeURIComponent(value.slice('memfs/'.length))
  }
  return decodeURIComponent(value)
}
