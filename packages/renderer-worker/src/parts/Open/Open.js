import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ElectronShell from '../ElectronShell/ElectronShell.js'

const openNativeFolderWeb = (absolutePath) => {
  throw new Error('not implemented')
}

const openNativeFolderRemote = async (absolutePath) => {
  try {
    await SharedProcess.invoke(
      /* Native.openFolder */ 'Native.openFolder',
      /* path */ absolutePath
    )
  } catch (error) {
    throw new VError(error, `Failed to open folder ${absolutePath}`)
  }
}

const openNativeFolderElectron = async (absolutePath) => {
  await ElectronShell.showItemInFolder(absolutePath)
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
      return
  }
}

export const openUrl = async (url) => {
  try {
    await RendererProcess.invoke(
      /* Open.openUrl */ 'Open.openUrl',
      /* url */ url
    )
  } catch (error) {
    throw new VError(error, `Failed to open url ${url}`)
  }
}
