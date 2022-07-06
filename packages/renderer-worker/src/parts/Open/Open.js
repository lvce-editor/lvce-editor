import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const openNativeFolder = async (absolutePath) => {
  await SharedProcess.invoke(
    /* Native.openFolder */ 'Native.openFolder',
    /* path */ absolutePath
  )
}

export const openUrl = async (url) => {
  await RendererProcess.invoke(/* Open.openUrl */ 'Open.openUrl', /* url */ url)
}
