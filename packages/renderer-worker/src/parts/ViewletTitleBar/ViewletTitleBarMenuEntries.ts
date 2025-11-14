import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await TitleBarWorker.invoke('TitleBar.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await TitleBarWorker.invoke('TitleBar.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
