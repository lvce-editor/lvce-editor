import * as Preferences from '../Preferences/Preferences.js'

export const getWatchConfig = () => {
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
