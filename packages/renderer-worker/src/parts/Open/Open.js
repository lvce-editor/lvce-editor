import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

const openUrlWeb = async (url) => {
  try {
    await RendererProcess.invoke(
      /* Open.openUrl */ 'Open.openUrl',
      /* url */ url
    )
  } catch (error) {
    throw new VError(error, `Failed to open url ${url}`)
  }
}

const openUrlElectron = async (url) => {
  await ElectronWindow.openNew(url)
}

export const openUrl = async (url) => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return openUrlElectron(url)
    default:
      return openUrlWeb(url)
  }
}
