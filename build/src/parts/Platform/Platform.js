export const isWindows = () => {
  return process.platform === 'win32'
}

export const isMacos = () => {
  return process.platform === 'darwin'
}

export const isLinux = () => {
  return process.platform === 'linux'
}

const normalizePathPrefix = (prefix) => {
  if (prefix === '') {
    return ''
  }
  if (prefix === '/') {
    return ''
  }
  if (prefix.endsWith('/')) {
    if (prefix.startsWith('/')) {
      return prefix.slice(0, -1)
    }
    return '/' + prefix.slice(0, -1)
  }
  if (!prefix.startsWith('/')) {
    prefix = '/' + prefix
  }
  return prefix
}

export const getPathPrefix = () => {
  const prefix = process.env.PATH_PREFIX || ''
  return normalizePathPrefix(prefix)
}
