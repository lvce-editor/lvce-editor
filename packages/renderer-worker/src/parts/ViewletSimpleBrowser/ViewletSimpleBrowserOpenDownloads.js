import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const openDownloads = async (state) => {
  const downloadsFolder = await PlatformPaths.getDownloadDir()
  await OpenNativeFolder.openNativeFolder(downloadsFolder)
  return state
}
