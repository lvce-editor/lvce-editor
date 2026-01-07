import * as SettingsWorker from '../SettingsWorker/SettingsWorker.ts'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await SettingsWorker.invoke('Settings.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await SettingsWorker.invoke('Settings.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
