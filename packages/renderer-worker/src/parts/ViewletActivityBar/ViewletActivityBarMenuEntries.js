import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ActivityBarWorker.invoke('ActivityBar.getMenuEntryIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await ActivityBarWorker.invoke('ActivityBar.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
