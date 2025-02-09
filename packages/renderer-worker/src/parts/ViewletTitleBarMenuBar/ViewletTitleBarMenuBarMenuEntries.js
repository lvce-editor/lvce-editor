import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const menus = []

export const getMenus = async () => {
  const ids = await TitleBarWorker.invoke('TitleBar.getMenuIds')
  const modules = []
  for (const id of ids) {
    modules.push({
      id,
      async getMenuEntries() {
        const entries = await TitleBarWorker.invoke('TitleBar.getMenuEntries', id)
        return entries
      },
    })
  }
  return modules
}
