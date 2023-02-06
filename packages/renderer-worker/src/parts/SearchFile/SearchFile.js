import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as IsUnhelpfulImportError from '../IsUnhelpfulImportError/IsUnhelpfulImportError.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'

const getModule = (protocol) => {
  if (protocol === '') {
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
    default:
      return import('../SearchFileWithRipGrep/SearchFileWithRipGrep.js')
  }
}

export const searchFile = async (path, value) => {
  try {
    const protocol = GetProtocol.getProtocol(path)
    const module = await getModule(protocol)
    return module.searchFile(path, value)
  } catch (error) {
    if (IsUnhelpfulImportError.isUnhelpfulImportError(error)) {
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(error)
      throw new Error(actualErrorMessage)
    }
    throw error
  }
}
