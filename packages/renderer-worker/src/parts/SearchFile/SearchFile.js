import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'
import * as Preferences from '../Preferences/Preferences.js'

const getModule = (protocol) => {
  if (IsEmptyString.isEmptyString(protocol)) {
    // TODO only read preference once when opening quickpick
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
    case FileSystemProtocol.Html:
      return import('../SearchFileWithHtml/SearchFileWithHtml.js')
    default:
      return import('../SearchFileWithRipGrep/SearchFileWithRipGrep.js')
  }
}

export const searchFile = async (path, value) => {
  const protocol = GetProtocol.getProtocol(path)
  const module = await getModule(protocol)
  return module.searchFile(path, value)
}
