const getHeaderValue = (headers, name) => {
  const lowerCaseName = name.toLowerCase()
  for (const [key, value] of Object.entries(headers || {})) {
    if (key.toLowerCase() === lowerCaseName) {
      return value
    }
  }
  return ''
}

const normalizeHeaderValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(',')
  }
  if (typeof value !== 'string') {
    return ''
  }
  return value
}

const getAllowedHosts = (headers) => {
  const host = normalizeHeaderValue(getHeaderValue(headers, 'host'))
  const forwardedHost = normalizeHeaderValue(getHeaderValue(headers, 'x-forwarded-host'))
  const hosts = [host, ...forwardedHost.split(',')]
  return hosts.map((host) => host.trim().toLowerCase()).filter(Boolean)
}

export const isAllowedWebSocketOrigin = (request) => {
  const { headers } = request
  const origin = normalizeHeaderValue(getHeaderValue(headers, 'origin'))
  if (!origin) {
    return false
  }
  try {
    const url = new URL(origin)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false
    }
    const originHost = url.host.toLowerCase()
    const allowedHosts = getAllowedHosts(headers)
    return allowedHosts.includes(originHost)
  } catch {
    return false
  }
}
