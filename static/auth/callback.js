export const getSafeReturnUrl = (value, callbackHref) => {
  const callbackUrl = new URL(callbackHref)
  const callbackPath = '/auth/callback'
  const basePath = callbackUrl.pathname.endsWith(callbackPath) ? callbackUrl.pathname.slice(0, -callbackPath.length) : ''
  const fallbackUrl = `${callbackUrl.origin}${basePath}/`
  if (!value) {
    return fallbackUrl
  }
  try {
    const url = new URL(value, callbackHref)
    if (url.origin !== callbackUrl.origin) {
      return fallbackUrl
    }
    for (const key of ['code', 'state', 'error', 'error_description']) {
      url.searchParams.delete(key)
    }
    return url.href
  } catch {
    return fallbackUrl
  }
}
