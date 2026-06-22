import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await DiffViewWorker.invoke('DiffView.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await DiffViewWorker.invoke('DiffView.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
