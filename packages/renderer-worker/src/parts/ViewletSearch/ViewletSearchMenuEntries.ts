import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await TextSearchViewWorker.invoke('TextSearch.getMenuEntryIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await TextSearchViewWorker.invoke('TextSearch.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
