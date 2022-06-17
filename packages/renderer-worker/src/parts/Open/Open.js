import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const openNativeFolder = async (absolutePath) => {
  await SharedProcess.invoke(
    /* Native.openFolder */ 'Native.openFolder',
    /* path */ absolutePath
  )
}
