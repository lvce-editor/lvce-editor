import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'App'

const getModule = (uri) => {
  switch (uri) {
    case 'startup-performance':
      return import('./FileSystemAppStartupPerformance.js')
    case 'memory-usage':
      return import('./FileSystemAppMemoryUsage.js')
    case 'settings.json':
      return import('./FileSystemAppSettings.js')
    case 'recently-opened.json':
      return import('./FileSystemAppRecentlyOpened.js')
    case 'session.json':
      return import('./FileSystemAppSession.js')
    default:
      throw new Error(`unsupported file: ${uri}`)
  }
}

export const readFile = async (uri) => {
  const module = await getModule(uri)
  return module.readFile()
}

export const writeFile = async (uri, content) => {
  const module = await getModule(uri)
  return module.writeFile(content)
}

export const readDirWithFileTypes = () => {
  return []
}

export const rename = async (oldUri, newUri) => {
  throw new Error('not allowed')
}

export const remove = async (path) => {
  throw new Error('not allowed')
}

export const mkdir = async (path) => {
  throw new Error('not allowed')
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const canBeRestored = true
