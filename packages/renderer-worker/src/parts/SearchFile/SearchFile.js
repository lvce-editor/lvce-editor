import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

const getModule = (protocol) => {
  switch (protocol) {
    case FileSystemProtocol.Web:
      return import('../SearchFileWeb/SearchFileWeb.js')
    case FileSystemProtocol.Memfs:
      return import('../SearchFileMemfs/SearchFileMemfs.js')
    case FileSystemProtocol.Fetch:
      return import('../SearchFileWithFetch/SearchFileWithFetch.js')
    default:
      return import('../SearchFileRemote/SearchFileRemote.js')
  }
}

export const searchFile = async (path, value) => {
  const protocol = GetProtocol.getProtocol(path)
  const module = await getModule(protocol)
  return module.searchFile(path, value)
}
