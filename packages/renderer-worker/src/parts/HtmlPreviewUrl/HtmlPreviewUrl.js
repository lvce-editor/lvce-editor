const prefix = 'html-preview:///'

export const isHtmlPreviewUrl = (url) => typeof url === 'string' && url.startsWith(prefix)

export const encode = (uri) => prefix + encodeURIComponent(uri)

export const decode = (url) => {
  if (!isHtmlPreviewUrl(url)) throw new Error('Invalid HTML preview URL')
  return decodeURIComponent(url.slice(prefix.length))
}
