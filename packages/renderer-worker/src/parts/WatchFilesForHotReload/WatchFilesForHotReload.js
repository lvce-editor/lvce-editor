import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getWatchConfig = () => {
  const watchConfig = []
  const explorerPath = Preferences.get('develop.explorerWorkerPath')
  if (explorerPath) {
    watchConfig.push({
      path: explorerPath,
      command: 'Explorer.hotReload',
    })
  }
  const textSearchWorkerPath = Preferences.get('develop.textSearchWorkerPath')
  if (textSearchWorkerPath) {
    watchConfig.push({
      path: textSearchWorkerPath,
      command: 'Search.hotReload',
    })
  }
  return watchConfig
}

export const watchFilesForHotReload = async (platform) => {
  try {
    if (platform === PlatformType.Web) {
      return
    }
    const config = getWatchConfig()
    if (config.length === 0) {
      return
    }
    await SharedProcess.invoke('ExtensionHost.watchForHotReload', config)
  } catch (error) {
    console.warn(`Failed to watch ${error}`)
  }
}
