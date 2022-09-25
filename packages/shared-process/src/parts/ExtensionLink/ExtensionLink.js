import VError from 'verror'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as SymLink from '../SymLink/SymLink.js'

const linkFallBack = async (path) => {
  try {
    const extensionsPath = Platform.getExtensionsPath()
    const baseName = Path.basename(path)
    const to = Path.join(extensionsPath, baseName)
    await FileSystem.remove(to)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    throw new VError(error, `Failed to link extension`)
  }
}

export const link = async (path) => {
  try {
    const extensionsPath = Platform.getExtensionsPath()
    const baseName = Path.basename(path)
    const to = Path.join(extensionsPath, baseName)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    if (error && error.code === FileSystemErrorCodes.EEXIST) {
      return linkFallBack(path)
    }
    throw new VError(error, `Failed to link extension`)
  }
}
