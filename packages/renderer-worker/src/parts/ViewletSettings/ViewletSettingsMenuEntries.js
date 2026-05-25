import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await SettingsViewWorker.invoke('Settings.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await SettingsViewWorker.invoke('Settings.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
