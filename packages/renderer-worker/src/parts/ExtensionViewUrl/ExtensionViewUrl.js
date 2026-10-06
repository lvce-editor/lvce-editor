const prefix = 'extension-view:///'

export const isExtensionViewUrl = (url) => typeof url === 'string' && url.startsWith(prefix)

export const encode = (viewId) => `${prefix}${encodeURIComponent(viewId)}`

export const decode = (url) => {
  if (!isExtensionViewUrl(url)) throw new Error('Invalid extension view URL')
  return decodeURIComponent(url.slice(prefix.length))
}
