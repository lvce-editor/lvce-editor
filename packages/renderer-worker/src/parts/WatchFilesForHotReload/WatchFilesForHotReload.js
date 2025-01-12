import * as GetWatchConfig from '../GetWatchConfig/GetWatchConfig.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const watchFilesForHotReload = async (platform) => {
  try {
    if (platform === PlatformType.Web) {
      return
    }
    const config = GetWatchConfig.getWatchConfig()
    if (config.length === 0) {
      return
    }
    await SharedProcess.invoke('ExtensionHost.watchForHotReload', config)
  } catch (error) {
    console.warn(`Failed to watch ${error}`)
  }
}
