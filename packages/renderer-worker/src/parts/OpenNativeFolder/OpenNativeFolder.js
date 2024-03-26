import * as OpenExternal from '../OpenExternal/OpenExternal.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import { VError } from '../VError/VError.js'

const openNativeFolderWeb = (absolutePath) => {
  throw new Error('not implemented')
}

const openNativeFolderRemote = async (absolutePath) => {
  try {
    await SharedProcess.invoke(SharedProcessCommandType.OpenNativeFolder, /* path */ absolutePath)
  } catch (error) {
    throw new VError(error, `Failed to open folder ${absolutePath}`)
  }
}

const openNativeFolderElectron = async (absolutePath) => {
  await OpenExternal.showItemInFolder(absolutePath)
}

export const openNativeFolder = async (absolutePath) => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return openNativeFolderWeb(absolutePath)
    case PlatformType.Remote:
      return openNativeFolderRemote(absolutePath)
    case PlatformType.Electron:
      return openNativeFolderElectron(absolutePath)
    default:
  }
}
