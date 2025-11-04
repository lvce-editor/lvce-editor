import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await TextSearchWorker.invoke('Search.getMenuEntryIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await TextSearchWorker.invoke('Search.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
