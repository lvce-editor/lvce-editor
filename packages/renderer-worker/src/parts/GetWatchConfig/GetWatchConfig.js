import * as Preferences from '../Preferences/Preferences.js'
import * as Workers from '../Workers/Workers.js'

export const getWatchConfig = () => {
  return Workers.getWorkersWithHotReload()
    .map((worker) => {
      const path = Preferences.get(worker.settingName)
      if (!path) {
        return undefined
      }
      return {
        path,
        command: worker.hotReloadCommand,
      }
    })
    .filter(Boolean)
}
