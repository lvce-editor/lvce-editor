export const name = 'App'

const getModule = (uri) => {
  switch (uri) {
    case 'app://startup-performance':
      return import('./FileSystemAppStartupPerformance.js')
    case 'app://memory-usage':
      return import('./FileSystemAppMemoryUsage.js')
    case 'app://settings.json':
      return import('./FileSystemAppSettings.js')
    case 'app://recently-opened.json':
      return import('./FileSystemAppRecentlyOpened.js')
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
  return '/'
}
