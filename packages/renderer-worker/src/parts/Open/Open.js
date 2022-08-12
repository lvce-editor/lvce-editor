import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

export const openNativeFolder = async (absolutePath) => {
  try {
    await SharedProcess.invoke(
      /* Native.openFolder */ 'Native.openFolder',
      /* path */ absolutePath
    )
  } catch (error) {
    throw new VError(error, `Failed to open folder ${absolutePath}`)
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
