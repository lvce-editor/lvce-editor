import * as GetRecentlyOpened from '../GetRecentlyOpened/GetRecentlyOpened.js'
import * as SetRecentlyOpened from '../SetRecentlyOpened/SetRecentlyOpened.js'

const getUriKey = (uri) => {
  if (!uri.startsWith('/') && !uri.startsWith('file://')) {
    return uri
  }
  try {
    const url = new URL(uri.startsWith('/') ? `file://${uri}` : uri)
    while (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.href
  } catch {
    return uri
  }
}

export const removeRecentlyOpened = async (uri) => {
  const key = getUriKey(uri)
  const recentlyOpened = await GetRecentlyOpened.getRecentlyOpened()
  const newRecentlyOpened = recentlyOpened.filter((entry) => getUriKey(entry) !== key)
  if (newRecentlyOpened.length === recentlyOpened.length) {
    return
  }
  await SetRecentlyOpened.setRecentlyOpened(newRecentlyOpened)
}
