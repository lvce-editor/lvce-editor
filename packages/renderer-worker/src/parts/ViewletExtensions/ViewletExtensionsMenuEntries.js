import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ExtensionSearchViewWorker.invoke('SearchExtensions.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await ExtensionSearchViewWorker.invoke('SearchExtensions.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
