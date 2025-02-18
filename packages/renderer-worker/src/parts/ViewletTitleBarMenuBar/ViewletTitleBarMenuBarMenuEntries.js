import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as Platform from '../Platform/Platform.js'

export const menus = []

export const getMenus = async () => {
  const ids = await TitleBarWorker.invoke('TitleBar.getMenuIds')
  const modules = []
  for (const id of ids) {
    modules.push({
      id,
      async getMenuEntries() {
        const entries = await TitleBarWorker.invoke('TitleBar.getMenuEntries', id, Platform.platform)
        return entries
      },
    })
  }
  return modules
}
