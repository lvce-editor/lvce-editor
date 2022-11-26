import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as Preferences from '../Preferences/Preferences.js'

const getModule = (protocol) => {
  if (protocol === '') {
    const preference = Preferences.get('search.searchWith')
    if (preference === 'git-ls-files') {
      return import('../SearchFileWIthGitLsFiles/SearchFileWIthGitLsFiles.js')
    }
  }
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
