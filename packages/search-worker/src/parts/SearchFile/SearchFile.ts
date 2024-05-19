import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.ts'
import * as GetProtocol from '../GetProtocol/GetProtocol.ts'

const getModule = (protocol) => {
  // TODO read preferences from renderer worker
  // if (IsEmptyString.isEmptyString(protocol)) {
  //   // TODO only read preference once when opening quickpick
  //   const preference = Preferences.get('search.searchWith')
  //   if (preference === 'git-ls-files') {
  //     return import('../SearchFileWIthGitLsFiles/SearchFileWIthGitLsFiles.js')
  //   }
  // }
  switch (protocol) {
    case FileSystemProtocol.Web:
      return import('../SearchFileWeb/SearchFileWeb.ts')
    case FileSystemProtocol.Memfs:
      return import('../SearchFileMemfs/SearchFileMemfs.ts')
    case FileSystemProtocol.Fetch:
      return import('../SearchFileWithFetch/SearchFileWithFetch.ts')
    case FileSystemProtocol.Html:
      return import('../SearchFileWithHtml/SearchFIleWithHtml.ts')
    default:
      return import('../SearchFileWithRipGrep/SearchFileWithRipGrep.ts')
  }
}

export const searchFile = async (path, value) => {
  const protocol = GetProtocol.getProtocol(path)
  const module = await getModule(protocol)
  return module.searchFile(path, value)
}
