import * as Location from '../Location/Location.js'

const hasAuthCallbackSearchParams = (href) => {
  try {
    const url = new URL(href)
    return url.searchParams.has('code') || url.searchParams.has('error')
  } catch {
    return false
  }
}

export const cleanAuthCallbackUrl = async (href) => {
  if (!hasAuthCallbackSearchParams(href)) {
    return
  }
  const url = new URL(href)
  await Location.setPathName(url.pathname)
}
