import * as FileSystem from '../FileSystem/FileSystem.js'

const getModule = (protocol) => {
  switch (protocol) {
    case 'memfs':
      return import('../SearchFileWeb/SearchFileWeb.js')
    default:
      return import('../SearchFileRemote/SearchFileRemote.js')
  }
}

export const searchFile = async (path, value) => {
  const protocol = FileSystem.getProtocol(path)
  const module = await getModule(protocol)
  return module.searchFile(path, value)
}
