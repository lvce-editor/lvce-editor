import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
