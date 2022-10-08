import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'

const getModule = (protocol) => {
  switch (protocol) {
    case FileSystemProtocol.Web:
      return import('../SearchFileWeb/SearchFileWeb.js')
    case FileSystemProtocol.Memfs:
      return import('../SearchFileMemfs/SearchFileMemfs.js')
    default:
      return import('../SearchFileRemote/SearchFileRemote.js')
  }
}

export const searchFile = async (path, value) => {
  const protocol = FileSystem.getProtocol(path)
  const module = await getModule(protocol)
  return module.searchFile(path, value)
}
