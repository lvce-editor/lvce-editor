import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const openConfigFolder = async () => {
  const configFolder = await PlatformPaths.getConfigPath()
  await OpenNativeFolder.openNativeFolder(configFolder)
}

export const openCacheFolder = async () => {
  const cacheFolder = await PlatformPaths.getCachePath()
  await OpenNativeFolder.openNativeFolder(cacheFolder)
}

export const openDataFolder = async () => {
  const dataFolder = await SharedProcess.invoke(/* Platform.getDataDir */ 'Platform.getDataDir')
  await OpenNativeFolder.openNativeFolder(dataFolder)
}

export const openLogsFolder = async () => {
  // TODO only in electron or in remote when it is the same machine
  if (Platform.platform === PlatformType.Web) {
    return
  }
  const logsFolder = await PlatformPaths.getLogsDir()
  await SharedProcess.invoke('FileSystem.mkdir', /* path */ logsFolder)
  await OpenNativeFolder.openNativeFolder(logsFolder)
}
