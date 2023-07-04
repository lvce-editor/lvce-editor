import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const openConfigFolder = async () => {
  const configFolder = await Platform.getConfigPath()
  await OpenNativeFolder.openNativeFolder(configFolder)
}

export const openCacheFolder = async () => {
  const cacheFolder = await Platform.getCachePath()
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
  const logsFolder = await Platform.getLogsDir()
  await OpenNativeFolder.openNativeFolder(logsFolder)
}
